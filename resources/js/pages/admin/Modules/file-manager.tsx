import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';
import { FileManagerList, FileManagerActions } from '@components/Modules/FileManager';
import { MakeDirPopUp, SubmitDeleteActionPopUp, UpdateNodePopUp } from '@components/Modules/FileManager/pop-up';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchFileManagerDirectory } from '@store/thunks/Modules';
import { useEffect } from 'react';

export default function FileManager(props) {
    const {
        directory: mainDirectory
    } = props

    const { breadcrumbs, nodeToUpdate, nodeToDelete, selectedNodes } = useAppSelector(state => state.fileManager);
    const dispatch = useAppDispatch();

    //TODO: Move directory (Path to it (Drag & Drop? | Dropdown | Popup with grid folders?))

    //TODO: Add file
    //TODO: Update file info
    //TODO: Move file (Path to it (Drag & Drop? | Dropdown | Popup with grid folders?))
    //TODO: Delete file

    //TODO: Sidebar
    //TODO: Arrow navigation (go up one level)
    //TODO: WAY IN THE FUTURE!! Calculate number of files current screen resolution can fit.
    //TODO: Pagination

    const customBreadcrumbAction = (breadcrumbId) => {
        dispatch(fetchFileManagerDirectory(breadcrumbId))
    }

    return (
        <AppLayout>
            <AdminContentLayout
                breadcrumbs={breadcrumbs}
                customBreadcrumbAction={customBreadcrumbAction}
                customBreadcrumbHeadingAction={customBreadcrumbAction}
                contentActions={<FileManagerActions/>}
            >
                <FileManagerList mainDirectory={mainDirectory}/>
                <MakeDirPopUp/>
                {nodeToUpdate && (
                    <UpdateNodePopUp/>
                )}
                {(nodeToDelete || selectedNodes?.length > 0) && (
                    <SubmitDeleteActionPopUp/>
                )}
            </AdminContentLayout>
        </AppLayout>
    );
}

import { FileManagerDir, FileManagerFile } from '@types/Modules/file-manager';
import { ManagerItem } from '@components/Modules/FileManager';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect, useState } from 'react';
import { handleMakeDirPopUp, setBreadcrumbs, setCurrentDir } from '@store/slices/Modules/fileManagerSlice';
import { ContextMenu, ContextMenuDivider, ContextMenuItem } from '@components/common/ContextMenu';

interface FileManagerListProps {
    mainDirectory: FileManagerDir;
}

export const FileManagerList = (props: FileManagerListProps) => {
    const {
        mainDirectory
    } = props;

    const dispatch = useAppDispatch()
    const currentDir: FileManagerDir = useAppSelector((state) => state.fileManager.currentDir);
    const isEditable: boolean = useAppSelector((state) => state.fileManager.isEditable);

    useEffect(() => {
        dispatch(setBreadcrumbs([]));
        dispatch(setCurrentDir(mainDirectory))
    }, [dispatch]);

    const [contextMenu, setContextMenu] = useState<{
        isOpen: boolean;
        x: number;
        y: number;
        data: FileManagerDir | FileManagerFile | null;
    }>({
        isOpen: false,
        x: 0,
        y: 0,
        data: null,
    });

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({
            isOpen: true,
            x: event.clientX,
            y: event.clientY,
            data: null,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, isOpen: false });
    };

    const handleAction = (action: string) => {
        if (action === 'create-new-folder') {
            dispatch(handleMakeDirPopUp())
        }
    };

    return (
        <div
            onContextMenu={handleContextMenu}
            className={'flex flex-1'}
        >
            <div className={'flex flex-row flex-wrap gap-6 h-fit'}>
                {currentDir?.children?.map((dir, index) => (
                    <ManagerItem
                        key={index}
                        item={dir}
                        type={'directory'}
                        isShaking={isEditable}
                    />
                ))}
                {currentDir?.files?.map((file, index) => (
                    <ManagerItem
                        key={index}
                        item={file}
                        type={'file'}
                        isShaking={isEditable}
                    />
                ))}
            </div>
            <ContextMenu
                isOpen={contextMenu.isOpen}
                x={contextMenu.x}
                y={contextMenu.y}
                data={contextMenu.data}
                onClose={handleCloseContextMenu}
                onAction={handleAction}
            >
                <ContextMenuItem data-action="create-new-folder">Создать папку</ContextMenuItem>
            </ContextMenu>
        </div>
    )
}

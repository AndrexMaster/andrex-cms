import { FileManagerDir, FileManagerFile } from '@types/Modules/file-manager';
import { ManagerItem } from '@components/Modules/FileManager';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import React, { useEffect, useRef, useState } from 'react';
import {
    clearSelection,
    handleMakeDirPopUp,
    handleSelectable,
    setBreadcrumbs,
    setCurrentDir
} from '@store/slices/Modules/fileManagerSlice';
import { ContextMenu, ContextMenuDivider, ContextMenuItem } from '@components/common/ContextMenu';
import { ContextFileUpload } from '@components/common/ContextMenu/ContextFileUpload';
import { uploadFileManagerFile } from '@store/thunks/Modules';

interface FileManagerListProps {
    mainDirectory: FileManagerDir;
}

export const FileManagerList = (props: FileManagerListProps) => {
    const {
        mainDirectory
    } = props;

    const dispatch = useAppDispatch()
    const currentDir: FileManagerDir = useAppSelector((state) => state.fileManager.currentDir);
    const {
        isEditable,
        isSelectable
    } : {
        isEditable: boolean,
        isSelectable: boolean
    } = useAppSelector((state) => state.fileManager);

    const fileInputRef = useRef<HTMLInputElement | null>(null)

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
        if (isSelectable) {
            dispatch(handleSelectable())
            dispatch(clearSelection())
        }
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, isOpen: false });
    };

    const handleAction = (action: string) => {
        switch (action) {
            case 'create-new-folder':
                dispatch(handleMakeDirPopUp())
                break;
            case 'upload-file':
                if (fileInputRef.current) {
                    fileInputRef.current.click();
                }
                break;
        }
    };

    const handleUploadFile = (files: File[]) => {
        if (files.length > 1) {
            dispatch(uploadFileManagerFile({ files: files, directoryId: currentDir.id }));
        }
    }

    useEffect(() => {
        dispatch(setBreadcrumbs([]));
        dispatch(setCurrentDir(mainDirectory))
    }, [dispatch]);

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
                <ContextMenuItem
                    data-action="upload-file"
                    fileInputRef={fileInputRef}
                    handleUploadFile={handleUploadFile}
                    variant={'file-loader'}

                >
                    Загрузить файл
                </ContextMenuItem>
            </ContextMenu>
            {fileInputRef && handleUploadFile && (
                <ContextFileUpload fileInputRef={fileInputRef} handleUploadFile={handleUploadFile}/>
            )}
        </div>
    )
}

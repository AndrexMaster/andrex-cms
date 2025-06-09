import { FileManagerDir, FileManagerFile, FileManagerTree } from '@types/Modules/file-manager';
import { Attributes, useState } from 'react';
import { Folder, File, Square, SquareCheck, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    handleUpdateNodePopUpOpen,
    selectNode,
    setCurrentDir,
    setFileManagerTree, setNodeToUpdate
} from '@store/slices/Modules/fileManagerSlice';
import { fetchFileManagerDirectory } from '@store/thunks/Modules';
import log from 'eslint-plugin-react/lib/util/log';
import { ContextMenu, ContextMenuItem, ContextMenuDivider  } from '@components/common/ContextMenu';

interface ManagerItemProps extends Attributes {
    item: FileManagerDir | FileManagerFile;
    type: 'file' | 'directory';
    isShaking?: boolean;
    handleRemove?: () => void;
    handleUpdate?: () => void;
}

interface ItemIconProps {
    item: FileManagerDir | FileManagerFile;
    iconType?: 'file' | 'directory';
    className?: string;
}

const ItemIcon = (props: ItemIconProps) => {
    const {
        iconType,
        item,
        className = '',
    } = props;

    const iconSize = '30px';

    switch (iconType) {
        case 'file':
            if ((item as FileManagerFile)?.url?.length > 0) {
                return <img
                    width={iconSize}
                    src={(item as FileManagerFile).url}
                    className={`max-w-full h-auto aspect-square object-contain ${className}`}
                />
            } else {
                return <File className={className} size={iconSize}/>;
            }
        case 'directory':
            if ((item as FileManagerDir)?.children?.length > 0 || (item as FileManagerDir)?.files?.length > 0) {
                return <Folder size={iconSize} className={`fill-white ${className}`}/>;
            } else {
                return <Folder className={className} size={iconSize}/>;
            }
        default:
            return <Folder className={className} size={iconSize}/>;
    }
};

export const ManagerItem = (props: ManagerItemProps) => {
    const {
        item,
        type,
        key,
        //TODO: Возможно стоит анимацию дрожания когда елемент выбран
        isShaking = false,
        handleRemove,
        handleUpdate,
    } = props;

    const isSelectable: boolean = useAppSelector((state) => state.fileManager.isSelectable);
    const [isMouseEnter, setIsMouseEnter] = useState(false);

    const dispatch = useAppDispatch()

    const handleItemClick = () => {
        if (isSelectable) {
            dispatch(selectNode(item.id))
        } else {
            if (type !== 'directory') return
            dispatch(fetchFileManagerDirectory(item.id))
            dispatch(setCurrentDir(item))
        }
    }

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
        event.stopPropagation();
        setContextMenu({
            isOpen: true,
            x: event.clientX,
            y: event.clientY,
            data: item,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, isOpen: false });
    };

    const handleAction = (action: string, itemData: FileManagerDir | FileManagerFile) => {
        switch (action) {
            case 'open':
                handleItemClick()
                break;
            case 'update':
                dispatch(setNodeToUpdate(item))
                dispatch(handleUpdateNodePopUpOpen(true))
                break;
        }
    };

    return (
        <div
            onContextMenu={handleContextMenu}
            className={`
                flex flex-col rounded-sm justify-center w-[100px] text-center items-center gap-2
                p-2 border-red-100 hover:bg-white/10 cursor-pointer
                relative
            `}
            title={item?.name ?? ''}
            draggable={true}
            onMouseEnter={() => setIsMouseEnter(true)}
            onMouseLeave={() => setIsMouseEnter(false)}
        >
            {isSelectable && (
                <div
                    className={'absolute top-0 right-0'}
                >
                    {item?.isSelected ? <SquareCheck size={'14px'}/> : <Square size={'14px'} />}
                </div>
            )}
            <div
                className={'flex flex-col rounded-sm justify-center w-[100px] text-center items-center gap-2'}
                onClick={handleItemClick}
            >
                <div>
                    {<ItemIcon iconType={type} item={item} />}
                </div>
                <span className={'flex-1 line-clamp-2'}>{item?.name ?? ''}</span>
            </div>
            <ContextMenu
                isOpen={contextMenu.isOpen}
                x={contextMenu.x}
                y={contextMenu.y}
                data={contextMenu.data}
                onClose={handleCloseContextMenu}
                onAction={handleAction}
            >
                <ContextMenuItem data-action="open">Открыть</ContextMenuItem>
                <ContextMenuItem data-action="update">Изменить</ContextMenuItem>
                <ContextMenuItem data-action="delete" data-hover-color={'sky/100'}>Удалить</ContextMenuItem>
                {contextMenu.data && (contextMenu.data as FileManagerDir).children ? (
                    null
                    // <ContextMenuItem data-action="create-new-folder">Создать папку</ContextMenuItem>
                ) : (
                    <>
                        <ContextMenuDivider />
                        <ContextMenuItem data-action="download">Скачать</ContextMenuItem>
                    </>
                )}
            </ContextMenu>
        </div>
    );
};

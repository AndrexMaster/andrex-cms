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

interface ManagerItemProps extends Attributes {
    item: FileManagerDir | FileManagerFile;
    type: 'file' | 'directory';
    isShaking?: boolean;
    editMode?: boolean;
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
        isShaking = false,
        editMode = false,
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

    const handleItemUpdate = () => {
        dispatch(setNodeToUpdate(item))
        dispatch(handleUpdateNodePopUpOpen(true))
    }

    return (
        <div
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
            {isSelectable ? (
                <div
                    className={'absolute top-0 right-0'}
                >
                    {item?.isSelected ? <SquareCheck size={'14px'}/> : <Square size={'14px'} />}
                </div>
            ) : isMouseEnter && (
                <Settings
                    className={'absolute top-0 right-0 hover:text-gray-400 transition'}
                    size={24}
                    onClick={handleItemUpdate}
                />
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
        </div>
    );
};

import { FileManagerDir, FileManagerFile } from '@types/Modules/file-manager';
import { Attributes } from 'react';
import { Folder, File, Folders } from 'lucide-react';
import { useAppDispatch } from '@store/hooks';
import { setCurrentDir } from '@store/slices/Modules/fileManagerSlice';

interface ManagerItemProps extends Attributes {
    item: FileManagerDir | FileManagerFile;
    type: 'file' | 'directory';
}

interface ItemIconProps {
    item: FileManagerDir | FileManagerFile;
    iconType?: 'file' | 'directory';
}

const ItemIcon = (props: ItemIconProps) => {
    const {
        iconType,
        item
    } = props;

    switch (iconType) {
        case 'file':
            if ((item as FileManagerFile)?.url.length > 0) {
                return <img width={80} src={(item as FileManagerFile).url}/>
            } else {
                return <File />;
            }
        case 'directory':
            if ((item as FileManagerDir)?.children?.length > 0 || (item as FileManagerDir).files.length > 0) {
                return <Folder className={'fill-white'}/>;
                // return <Folders />
            } else {
                return <Folder/>;
            }
        default:
            return <Folder />;
    }
};

export const ManagerItem = (props: ManagerItemProps) => {
    const {
        item,
        type,
        key
    } = props;

    const dispatch = useAppDispatch()

    const open = () => {
        if (type !== 'directory') return
        dispatch(setCurrentDir(item as FileManagerDir))
    }


    return (
        <div
            className={`
                flex flex-col rounded-sm justify-center w-[100px] text-center items-center gap-2
                p-2 border-red-100 hover:bg-white/10 cursor-pointer
            `}
            onClick={open}
            title={item?.name ?? ''}
        >
            <div>
                {<ItemIcon iconType={type} item={item} />}
            </div>
            <span className={'flex-1 line-clamp-2'}>{item?.name ?? ''}</span>
        </div>
    );
};

import { FileManagerDir, FileManagerFile, FileManagerTree } from '@types/Modules/file-manager';
import { ManagerItem } from '@components/Modules/FileManager';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect } from 'react';
import { setFileManagerTree } from '@store/slices/Modules/fileManagerSlice';

interface FileManagerListProps {
    directories: FileManagerDir[]
    files: FileManagerFile[]
}

export const FileManagerList = (props: FileManagerListProps) => {
    const {
        directories,
        files
    } = props;

    const dispatch = useAppDispatch()
    const currentDir: FileManagerDir = useAppSelector((state) => state.fileManager.currentDir);

    useEffect(() => {
        dispatch(setFileManagerTree([...directories, ...files]))
    }, [dispatch]);

    return (
        <div className={'flex flex-row flex-wrap gap-6'}>
            {(currentDir?.children ?? directories)?.map((dir, index) => (
                <ManagerItem key={index} item={dir} type={'directory'}/>
            ))}
            {(currentDir?.files ?? files)?.map((file, index) => (
                <ManagerItem key={index} item={file} type={'file'}/>
            ))}
        </div>
    )
}

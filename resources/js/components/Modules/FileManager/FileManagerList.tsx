import { FileManagerDir, FileManagerFile, FileManagerTree } from '@types/Modules/file-manager';
import { ManagerItem } from '@components/Modules/FileManager';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect, useMemo } from 'react';
import { setBreadcrumbs, setCurrentDir, setFileManagerTree } from '@store/slices/Modules/fileManagerSlice';

interface FileManagerListProps {
    mainDirectory: FileManagerDir;
}

export const FileManagerList = (props: FileManagerListProps) => {
    const {
        mainDirectory
    } = props;

    const dispatch = useAppDispatch()
    const currentDir: FileManagerDir = useAppSelector((state) => state.fileManager.currentDir);

    useEffect(() => {
        dispatch(setBreadcrumbs([]));
        dispatch(setCurrentDir(mainDirectory))
    }, [dispatch]);

    return (
        <div className={'flex flex-row flex-wrap gap-6'}>
            {currentDir?.children?.map((dir, index) => (
                <ManagerItem key={index} item={dir} type={'directory'} />
            ))}
            {currentDir?.files?.map((file, index) => (
                <ManagerItem key={index} item={file} type={'file'} />
            ))}
        </div>
    )
}

import { AddImage } from '@components/Image';
import { FileUpload } from '@components/Fields';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect } from 'react';
import { createFileManagerDirectory, fetchFileManagerDirectory } from '@store/thunks/Modules';
import { AButton } from '@components/Buttons';
import { handleMakeDirPopUp } from '@store/slices/Modules/fileManagerSlice';
import { Plus } from 'lucide-react';

export const FileManagerActions = () => {
    const dispatch = useAppDispatch()
    const { tree, currentDir, loading, error } = useAppSelector(state => state.fileManager);

    const handleUploadFile = (files: File[]) => {
        console.log('handleUploadFile', files);
    }

    const createDir = () => {
        dispatch(handleMakeDirPopUp())

        // dispatch(createFileManagerDirectory({
        //     name: 'test',
        //     parent_id: currentDir.id ?? null
        // }))
    }

    useEffect(() => {
        dispatch(fetchFileManagerDirectory('45206061-152f-490d-9c01-47a2a6d0b6bc')); // Загружаем корневые элементы (directoryId = null)
    }, [dispatch]);

    return (
        <div className={'flex gap-4'}>
            <AButton onClick={createDir} title={'Create dir'} startIcon={<Plus size={18}/>} >Create</AButton>
            <FileUpload handleUploadFile={handleUploadFile}/>
        </div>
    )
}

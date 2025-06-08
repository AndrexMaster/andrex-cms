import { FileUpload } from '@components/Fields';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { AButton } from '@components/Buttons';
import { handleMakeDirPopUp, handleSelectable } from '@store/slices/Modules/fileManagerSlice';
import { Plus, SendToBack, Settings, SquareStack, Trash2 } from 'lucide-react';
import { Divider } from '@components/common';
import { useMemo } from 'react';

export const FileManagerActions = () => {
    const dispatch = useAppDispatch()
    const { currentDir } = useAppSelector(state => state.fileManager);

    const selected = useMemo(() => {
        let selected = []

        currentDir?.children.map((children) => {
            if (children?.isSelected) {
                selected.push(children);
            }
        })

        return selected
    }, [currentDir]);

    const handleUploadFile = (files: File[]) => {
        console.log('handleUploadFile', files);
    }

    const createDir = () => {
        dispatch(handleMakeDirPopUp())
    }

    // useEffect(() => {
    //     dispatch(fetchFileManagerDirectory('45206061-152f-490d-9c01-47a2a6d0b6bc')); // Загружаем корневые элементы (directoryId = null)
    // }, [dispatch]);

    return (
        <div className={'flex gap-4'}>
            <AButton onClick={createDir} title={'Create dir'} startIcon={<Plus size={18}/>} >Create</AButton>
            <AButton
                onClick={() => dispatch(handleSelectable())}
                title={'Create dir'}
                startIcon={<SquareStack size={18}/>}
            >
                Select
            </AButton>
            <FileUpload handleUploadFile={handleUploadFile}/>
            {selected?.length === 1 && (
                <>
                    <Divider orientation={'vertical'} />
                    <AButton onClick={createDir} color={'warning'} title={'Create dir'} startIcon={<Settings size={18}/>} >Edit</AButton>
                </>
            )}
            {selected?.length > 0 && (
                <>
                    <Divider orientation={'vertical'} />
                    <AButton onClick={createDir} color={'warning'} title={'Create dir'} startIcon={<SendToBack size={18}/>} >Move</AButton>
                    <AButton onClick={createDir} color={'error'} title={'Create dir'} startIcon={<Trash2 size={18}/>} >Delete</AButton>
                </>
            )}
        </div>
    )
}

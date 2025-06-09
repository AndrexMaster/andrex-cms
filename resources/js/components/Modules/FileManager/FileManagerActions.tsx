import { FileUpload } from '@components/Fields';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { AButton } from '@components/Buttons';
import {
    clearSelection,
    handleDeleteNodePopUpOpen,
    handleMakeDirPopUp,
    handleSelectable
} from '@store/slices/Modules/fileManagerSlice';
import { Plus, SendToBack, Settings, SquareStack, Trash2 } from 'lucide-react';
import { Divider } from '@components/common';
import { useMemo } from 'react';

export const FileManagerActions = () => {
    const dispatch = useAppDispatch()
    const { currentDir, isSelectable } = useAppSelector(state => state.fileManager);

    const selected = useMemo(() => {
        return currentDir?.children.filter(child => child.isSelected)
    }, [currentDir]);

    const handleUploadFile = (files: File[]) => {
        console.log('handleUploadFile', files);
    }

    const createDir = () => {
        dispatch(handleMakeDirPopUp())
    }
    const handleSelect = () => {
        dispatch(handleSelectable())
        if (isSelectable) {
            dispatch(clearSelection())
        }
    }

    const handleDeleteSelected = () => {
        dispatch(handleDeleteNodePopUpOpen(true))
    }

    // useEffect(() => {
    //     dispatch(fetchFileManagerDirectory('45206061-152f-490d-9c01-47a2a6d0b6bc')); // Загружаем корневые элементы (directoryId = null)
    // }, [dispatch]);

    return (
        <div className={'flex gap-4'}>
            <AButton onClick={createDir} title={'Create dir'} startIcon={<Plus size={18}/>} >Create</AButton>
            <AButton
                onClick={handleSelect}
                title={'Create dir'}
                startIcon={<SquareStack size={18}/>}
                className={isSelectable ? 'border-indigo-500 bg-indigo-500/20' : ''}
            >
                Select
            </AButton>
            <FileUpload handleUploadFile={handleUploadFile}/>
            {selected?.length === 1 && (
                <>
                    <Divider orientation={'vertical'} />
                    {/* //TODO: сделать*/}
                    <AButton onClick={createDir} color={'warning'} title={'Create dir'} startIcon={<Settings size={18}/>} >Edit</AButton>
                </>
            )}
            {selected?.length > 0 && (
                <>
                    <Divider orientation={'vertical'} />
                    {/* //TODO: сделать*/}
                    <AButton onClick={createDir} color={'warning'} title={'Create dir'} startIcon={<SendToBack size={18}/>} >Move</AButton>
                    <AButton onClick={handleDeleteSelected} color={'error'} title={'Create dir'} startIcon={<Trash2 size={18}/>} >Delete</AButton>
                </>
            )}
        </div>
    )
}

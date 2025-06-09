import { TextField } from '@components/Fields';
import { FileManagerPopUpLayout } from '@components/Modules/FileManager/pop-up';
import { AButton } from '@components/Buttons';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { updateFileManagerDirectory, updateFileManagerFile } from '@store/thunks/Modules';
import { FileManagerDir, FileManagerFile } from '@types/Modules/file-manager';
import { Divider } from '@components/common';
import { handleUpdateNodePopUpOpen } from '@store/slices/Modules/fileManagerSlice';

export const UpdateNodePopUp = (props) => {

    const { isUpdateNodePopUpOpen, nodeToUpdate } : {
        isUpdateNodePopUpOpen: boolean,
        nodeToUpdate: FileManagerDir | FileManagerFile
    } = useAppSelector(state => state.fileManager)

    const dispatch = useAppDispatch()

    const [nodeName, setNodeName] = useState('');

    const itemType = useMemo(() => {
        if ((nodeToUpdate as FileManagerDir)?.children) {
            return 'directory'
        } else {
            return 'file'
        }
    }, [nodeToUpdate]);

    const additionalDataKeys = [
        {
            title: 'id',
            key: 'id',
        },
        {
            title: 'name',
            key: 'name',
        },
    ]

    const updateDir = () => {
        if (itemType === 'directory') {
            dispatch(updateFileManagerDirectory({
                ...nodeToUpdate,
                name: nodeName // Используем nodeName из локального стейта
            }))
        } else {
            dispatch(updateFileManagerFile({
                ...nodeToUpdate,
                name: nodeName, // Обновляем name здесь! (вы забыли это в оригинальном коде)
                directory_id: (nodeToUpdate as FileManagerFile)?.directory_id ?? null
            }))
        }
    }

    useEffect(() => {
        if (isUpdateNodePopUpOpen && nodeToUpdate) {
            setNodeName(nodeToUpdate.name);
        } else {
            setNodeName('');
        }
    }, [isUpdateNodePopUpOpen, nodeToUpdate]);

    const closePopUp = () => {
        dispatch(handleUpdateNodePopUpOpen(false))
    }


    return (
        <FileManagerPopUpLayout
            heading={`Updating ${nodeToUpdate?.name ?? ''}`}
            closeHandler={closePopUp}
            isPopUpOpen={isUpdateNodePopUpOpen}
        >
            {nodeToUpdate && (
                <div className={'flex flex-col justify-between gap-6 flex-1'}>
                    <TextField
                        placeholder={itemType === 'directory' ? 'Folder name...' : 'File name...'}
                        title={itemType === 'directory' ? 'Folder name' : 'File name'}
                        value={nodeName}
                        onChange={setNodeName}
                    />
                    <Divider/>
                    <div
                        className={'flex flex-col gap-6'}
                    >
                        <div><i className={'text-xl'}>Details:</i></div>
                        <div className={'flex flex-col gap-2'}>
                            {additionalDataKeys.map(key => (
                                <div
                                    className={'flex flex-row gap-2'}
                                    key={key.key}
                                >
                                    <b>{key.title}:</b>
                                    <span className={'text-gray-400'}>{nodeToUpdate[key.key]}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                    <Divider/>
                    <AButton
                        onClick={updateDir}
                        disabled={nodeName?.length === 0 || nodeToUpdate.name === nodeName}
                    >
                        Update
                    </AButton>
                </div>
            )}
        </FileManagerPopUpLayout>
    )
}

import { FileManagerPopUpLayout } from '@components/FileManager/pop-up/index';
import { AButton } from '@components/Buttons';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { FileManagerDir, FileManagerFile } from '@types/file-manager';
import { handleDeleteNodePopUpOpen } from '@store/slices/fileManagerSlice';
import { useEffect, useState } from 'react';
import { deleteFileManagerDirectory, deleteFileManagerFile } from '@store/thunks';

export const SubmitDeleteActionPopUp = (props) => {
    const { isDeleteNodePopUpOpen, nodeToDelete, selectedNodes } : {
        isDeleteNodePopUpOpen: boolean,
        selectedNodes: (FileManagerDir | FileManagerFile )[] | null,
        nodeToDelete: FileManagerDir | FileManagerFile
    } = useAppSelector(state => state.fileManager)

    const [secondsLeft, setSecondsLeft] = useState(2);
    const [isAbleToDelete, setIsAbleToDelete] = useState(false);

    useEffect(() => {
        if (isDeleteNodePopUpOpen) {
            setIsAbleToDelete(false)
            setSecondsLeft(3)
        }
    }, [isDeleteNodePopUpOpen]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft(prevSeconds => prevSeconds - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            setIsAbleToDelete(true)
        }
    }, [secondsLeft]);

    const dispatch = useAppDispatch()

    const deleteNode = () => {
        const files = (selectedNodes ?? [nodeToDelete])?.filter((node) => !Array.isArray((node as FileManagerDir).children))
        const directories = (selectedNodes ?? [nodeToDelete])?.filter((node) => Array.isArray((node as FileManagerDir).children))


        if (files?.length > 0) {
            dispatch(deleteFileManagerFile(files))
        }
        if (directories?.length > 0) {
            dispatch(deleteFileManagerDirectory(directories))
        }
    }

    const closePopUp = () => {
        dispatch(handleDeleteNodePopUpOpen(false))
    }

    return (
        <FileManagerPopUpLayout
            heading={`Delete ${selectedNodes?.length > 0 ? String(selectedNodes?.length) + ' elements' : nodeToDelete?.name ?? ''} ?`}
            closeHandler={closePopUp}
            isPopUpOpen={isDeleteNodePopUpOpen}
        >
            {(nodeToDelete || selectedNodes?.length > 0 ) && (
                <div className={'flex flex-col justify-between gap-6 flex-1'}>
                    {selectedNodes?.length > 0 && (
                        <div>
                            <span>You really want to delete this elements?</span>
                            <div>
                                {selectedNodes?.map((node: (FileManagerFile | FileManagerDir), index: number) => (
                                    <div key={index} className={'flex flex-row items-center gap-2'}>
                                        <span>Name:</span>
                                        <span>{node.name ?? ''}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <AButton
                        onClick={deleteNode}
                        disabled={!isAbleToDelete}
                    >
                        Delete {secondsLeft > 0 ? String(secondsLeft) : null}
                    </AButton>
                </div>
            )}
        </FileManagerPopUpLayout>
    )
}

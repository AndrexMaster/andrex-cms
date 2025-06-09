import { FileManagerPopUpLayout } from '@components/Modules/FileManager/pop-up';
import { AButton } from '@components/Buttons';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { FileManagerDir, FileManagerFile } from '@types/Modules/file-manager';
import { handleDeleteNodePopUpOpen } from '@store/slices/Modules/fileManagerSlice';
import { useEffect, useState } from 'react';
import { deleteFileManagerNode } from '@store/thunks/Modules';

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
        dispatch(deleteFileManagerNode(selectedNodes?.length > 0 ? selectedNodes : nodeToDelete))
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

import { TextField } from '@components/Fields';
import { FileManagerPopUpLayout } from '@components/Modules/FileManager/pop-up';
import { AButton } from '@components/Buttons';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { createFileManagerDirectory } from '@store/thunks/Modules';
import { Plus } from 'lucide-react';
import { handleMakeDirPopUp } from '@store/slices/Modules/fileManagerSlice';

export const MakeDirPopUp = () => {
    const [folderName, setFolderName] = useState('');
    const dispatch = useAppDispatch()
    const currentDir = useAppSelector(state => state.fileManager.currentDir)
    const isPopUpOpen = useAppSelector(state => state.fileManager.isMakeDirPopUpOpen)

    const makeDir = () => {
        dispatch(createFileManagerDirectory({
            name: folderName,
            parent_id: currentDir?.id ?? null
        }))
    }

    useEffect(() => {
        setFolderName('')
        console.log('isPopUpOpen', isPopUpOpen);
    }, [isPopUpOpen]);

    const closePopUp = () => {
        dispatch(handleMakeDirPopUp(false))
    }

    return (
      <FileManagerPopUpLayout
          heading={'Make new folder?'}
          isPopUpOpen={isPopUpOpen}
          closeHandler={closePopUp}
      >
          <div className={'flex flex-col justify-between gap-6 flex-1'}>
              <TextField
                  placeholder={'Folder name...'}
                  title={'Folder name'}
                  onChange={setFolderName}
                  defaultValue={folderName}
              />
              <AButton
                  onClick={makeDir}
                  disabled={folderName.length <= 0}
              >
                  Create
              </AButton>
          </div>
      </FileManagerPopUpLayout>
    )
}

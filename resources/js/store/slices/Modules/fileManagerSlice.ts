import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { FileManagerDir, FileManagerTree } from '@types/Modules/file-manager';
import { createFileManagerDirectory, fetchFileManagerDirectory } from '@store/thunks/Modules';
import { addDirectoryToCurrent, removeDirectoryFromCurrent, updateDirectoryInCurrent } from '@store/utils';

interface FileManagerState {
    tree: FileManagerTree | null;
    currentDir: FileManagerDir | null;
    loading: boolean;
    error: string | null;
    isMakeDirPopUpOpen: boolean;
}

const initialState: FileManagerState = {
    tree: null, // TODO: Не факт что нужно
    currentDir: null,
    loading: false,
    error: null,
    isMakeDirPopUpOpen: false,
};

// TODO: Добавлять новую директорию в дерево Redux

const fileManagerSlice = createSlice({
    name: 'fileManager',
    initialState,
    reducers: {
        setCurrentDir: (state, action: PayloadAction<FileManagerDir>) => {
            state.currentDir = action.payload
        },
        setFileManagerTree: (state, action: PayloadAction<FileManagerTree>) => {
            state.tree = action.payload
        },
        updateTree: (state, action) => {
            state.tree = action.payload
        },
        handleMakeDirPopUp: (state, action: PayloadAction<boolean | undefined>) => {
            state.isMakeDirPopUpOpen = action.payload ?? !state.isMakeDirPopUpOpen
        },
    },
    extraReducers: (builder) => {
        builder
            // Get folder
            .addCase(fetchFileManagerDirectory.pending, (state: FileManagerState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFileManagerDirectory.fulfilled, (state: FileManagerState, action) => {
                state.loading = false;
                state.error = null;
                state.currentDir = action.payload.directory;
            })
            .addCase(fetchFileManagerDirectory.rejected, (state: FileManagerState, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.currentDir = null;
            })

            // Create folder
            .addCase(createFileManagerDirectory.pending, (state: FileManagerState, action) => {
                state.loading = true;
                state.error = null;

                const { name, parent_id } = action.meta.arg;
                const tempId = action.meta.requestId;
                const parentId = parent_id ?? '';

                const optimisticDir: FileManagerDir = {
                    id: tempId,
                    name: name,
                    parent_id: parentId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    files: [],
                    children: [],
                    isOptimistic: true,
                    tempId: tempId,
                };

                if (state.currentDir) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: addDirectoryToCurrent(state.currentDir, optimisticDir, parentId)
                    }
                }

                // Открывает созданную директорию после добавления
                // TODO: Сделать галочкой (хотите открыть дирректорию после создания?
                //  После получения положительного ответа открывать)
                // if (state.currentDir && state.currentDir.id === parent_id) {
                //     state.currentDir = {
                //         ...state.currentDir,
                //         children: [...(state.currentDir.children || []), optimisticDir]
                //     };
                // } else if (state.currentDir === null && parent_id === null) {
                //     state.currentDir = {
                //         ...optimisticDir,
                //     };
                // }
            })
            .addCase(createFileManagerDirectory.fulfilled, (state: FileManagerState, action) => {
                state.loading = false;
                state.error = null;

                const { data: response, parentId } = action.payload;
                const tempId = action.meta.requestId;
                console.log('fulfilled - tempId', tempId);

                if (state.currentDir && state.currentDir.id === parentId && tempId) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: updateDirectoryInCurrent(state.currentDir, tempId, response.directory as FileManagerDir)
                    };
                }
            })
            .addCase(createFileManagerDirectory.rejected, (state: FileManagerState, action) => {
                state.loading = false;
                state.error = action.payload as string;
                const tempId = action.meta.requestId;
                const { parent_id } = action.meta.arg;

                if (state.currentDir && tempId) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: removeDirectoryFromCurrent(state.currentDir, tempId, true)
                    }
                }

                if (state.currentDir && state.currentDir.id === parent_id && tempId) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: removeDirectoryFromCurrent(state.currentDir, tempId, true)
                    };
                }
            })

    },
});

export const {
    setCurrentDir, setFileManagerTree,
    handleMakeDirPopUp, updateTree
} = fileManagerSlice.actions;
export default fileManagerSlice.reducer;

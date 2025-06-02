import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileManagerDir, FileManagerTree } from '@types/Modules/file-manager';
import { createFileManagerDirectory, fetchFileManagerDirectory } from '@store/thunks/Modules';
import { addDirectoryToTree, removeDirectoryFromTree, updateDirectoryInTree } from '@store/utils';

interface FileManagerState {
    tree: FileManagerTree | null;
    currentDir: FileManagerDir | null;
    loading: boolean;
    error: string | null;
    isMakeDirPopUpOpen: boolean;
}

const initialState: FileManagerState = {
    tree: null,
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
            console.log('state.tree', state.tree);
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
                state.tree = action.payload;
                if (action.payload?.length > 0 && !state.currentDir) {
                    state.currentDir = action.payload[0];
                }
            })
            .addCase(fetchFileManagerDirectory.rejected, (state: FileManagerState, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.tree = null;
                state.currentDir = null;
            })

            .addCase(createFileManagerDirectory.pending, (state: FileManagerState, action) => {
                state.loading = true;
                state.error = null;

                const { name, parent_id } = action.meta.arg;
                const tempId = action.meta.requestId;

                const optimisticDir: FileManagerDir = {
                    id: tempId,
                    name: name,
                    parent_id: parent_id || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    files: [],
                    children: [],
                    isOptimistic: true,
                    tempId: tempId,
                };

                if (state.tree) {
                    state.tree = addDirectoryToTree(state.tree, optimisticDir, parent_id);
                } else {
                    state.tree = [optimisticDir];
                }

                if (state.currentDir && state.currentDir.id === parent_id) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: [...(state.currentDir.children || []), optimisticDir]
                    };
                } else if (state.currentDir === null && parent_id === null) {
                    state.currentDir = {
                        ...optimisticDir,
                    };
                }
            })
            .addCase(createFileManagerDirectory.fulfilled, (state: FileManagerState, action) => {
                state.loading = false;
                state.error = null;

                const { data: realDir, tempId, parentId } = action.payload;

                if (state.tree && tempId) {
                    state.tree = updateDirectoryInTree(state.tree, tempId, realDir);
                }

                if (state.currentDir && state.currentDir.id === parentId && tempId) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: updateDirectoryInTree(state.currentDir.children || [], tempId, realDir)
                    };
                }
            })
            .addCase(createFileManagerDirectory.rejected, (state: FileManagerState, action) => {
                state.loading = false;
                state.error = action.payload as string;
                const tempId = action.meta.requestId;
                const { parent_id } = action.meta.arg;

                if (state.tree && tempId) {
                    console.log('state', state);
                    state.tree = removeDirectoryFromTree(state.tree, tempId, true)
                }

                if (state.currentDir && state.currentDir.id === parent_id && tempId) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: removeDirectoryFromTree(state.currentDir.children || [], tempId, true)
                    };
                }
            });
    },
});

export const {
    setCurrentDir, setFileManagerTree,
    handleMakeDirPopUp, updateTree
} = fileManagerSlice.actions;
export default fileManagerSlice.reducer;

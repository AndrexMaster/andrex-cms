import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { FileManagerDir, FileManagerFile, FileManagerTree } from '@types/Modules/file-manager';
import {
    createFileManagerDirectory, deleteFileManagerNode,
    fetchFileManagerDirectory,
    getBreadcrumbs,
    updateFileManagerDirectory
} from '@store/thunks/Modules';
import {
    addDirectoryToCurrent,
    handleNodeSelectionHelper, handleNodeUnelectionHelper,
    removeDirectoryFromCurrent, removeNodeFromArr,
    updateDirectoryInCurrent
} from '@store/utils';

interface FileManagerState {
    tree: FileManagerTree | null;

    currentDir: FileManagerDir | null;
    nodeToUpdate: FileManagerDir | FileManagerFile | null;
    nodeToDelete: FileManagerDir | FileManagerFile | null;
    selectedNodes: (FileManagerDir | FileManagerFile)[] | null

    isMakeDirPopUpOpen: boolean;
    isUpdateNodePopUpOpen: boolean;
    isDeleteNodePopUpOpen: boolean;

    loading: boolean;
    error: string | null;
    breadcrumbs: {id: string, name: string}[];
    isSelectable: boolean;
}

const initialState: FileManagerState = {
    tree: null, // TODO: Не факт что нужно

    currentDir: null,
    nodeToUpdate: null,
    nodeToDelete: null,
    selectedNodes: null,

    isMakeDirPopUpOpen: false,
    isUpdateNodePopUpOpen: false,
    isDeleteNodePopUpOpen: false,

    isSelectable: false,

    breadcrumbs: [],

    loading: false,
    error: null,
};

const fileManagerSlice = createSlice({
    name: 'fileManager',
    initialState,
    reducers: {
        setCurrentDir: (state, action: PayloadAction<FileManagerDir>) => {
            state.currentDir = action.payload
        },
        setNodeToUpdate: (state, action: PayloadAction<FileManagerDir | FileManagerFile>) => {
            state.nodeToUpdate = action.payload
        },
        setNodeToDelete: (state, action: PayloadAction<FileManagerDir | FileManagerFile>) => {
            state.nodeToDelete = action.payload
        },
        setFileManagerTree: (state, action: PayloadAction<FileManagerTree>) => {
            state.tree = action.payload
        },
        clearSelection: (state, action) => {
            state.selectedNodes = null

            state.currentDir = {
                ...state.currentDir,
                children: handleNodeUnelectionHelper(state.currentDir.children),
                files: handleNodeUnelectionHelper(state.currentDir.files)
            }
        },
        selectNode: (state, action: PayloadAction<string>) => {
            const selectedDirs = handleNodeSelectionHelper(state.currentDir.children, action.payload).filter(node => node.isSelected === true)
            const selectedFiles = handleNodeSelectionHelper(state.currentDir.files, action.payload).filter(node => node.isSelected === true)

            state.selectedNodes = [...selectedDirs, ...selectedFiles];

            state.currentDir = {
                ...state.currentDir,
                children: handleNodeSelectionHelper(state.currentDir.children, action.payload),
                files: handleNodeSelectionHelper(state.currentDir.files, action.payload)
            }
        },

        // Tree
        updateTree: (state, action) => {
            state.tree = action.payload
        },

        // Breadcrumbs
        setBreadcrumbs: (state, action) => {
            state.breadcrumbs = action.payload
        },

        //  Handlers
        handleMakeDirPopUp: (state, action: PayloadAction<boolean | undefined>) => {
            state.isMakeDirPopUpOpen = action.payload ?? !state.isMakeDirPopUpOpen
        },
        handleUpdateNodePopUpOpen: (state, action: PayloadAction<boolean | undefined>) => {
            state.isUpdateNodePopUpOpen = action.payload ?? !state.isUpdateNodePopUpOpen
        },
        handleDeleteNodePopUpOpen: (state, action: PayloadAction<boolean | undefined>) => {
            state.isDeleteNodePopUpOpen = action.payload ?? !state.isDeleteNodePopUpOpen
        },
        handleSelectable: (state, action: PayloadAction<boolean | undefined>) => {
            state.isSelectable = action.payload ?? !state.isSelectable
        },
    },
    extraReducers: (builder) => {
        builder
            /**
             * Get directory
             */
            .addCase(fetchFileManagerDirectory.pending, (state: FileManagerState) => {
                state.loading = true;
                state.error = null;
                state.isMakeDirPopUpOpen = false;
            })
            .addCase(fetchFileManagerDirectory.fulfilled, (state: FileManagerState, action) => {
                state.loading = false;
                state.error = null;
                state.currentDir = (action.payload as {directory: FileManagerDir}).directory;
                state.isMakeDirPopUpOpen = false
            })
            .addCase(fetchFileManagerDirectory.rejected, (state: FileManagerState, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.currentDir = null;
                state.isMakeDirPopUpOpen = false
            })


            /**
             * Create directory
             */
            .addCase(createFileManagerDirectory.pending, (state: FileManagerState, action) => {
                state.loading = true;
                state.error = null;
                state.isMakeDirPopUpOpen = false

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

                if (state.currentDir && state.currentDir.id === parentId && tempId) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: updateDirectoryInCurrent(state.currentDir, tempId, (response as {directory: FileManagerDir}).directory)
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
                        children: removeNodeFromArr(state.currentDir.children, [tempId])
                    }
                }

                if (state.currentDir && state.currentDir.id === parent_id && tempId) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: removeNodeFromArr(state.currentDir.children, tempId)
                    };
                }

                // Todo: выводить ошибку вместе со всплывашкой
                state.isMakeDirPopUpOpen = true
            })

            /**
             * Update Directory
             */
            .addCase(updateFileManagerDirectory.fulfilled, (state: FileManagerState, action) => {
                const { directory: newDir }: FileManagerDir = action.payload;

                if (state.currentDir && state.currentDir.id === newDir.parent_id) {
                    state.currentDir = {
                        ...state.currentDir,
                        children: updateDirectoryInCurrent(state.currentDir, newDir.id, newDir as FileManagerDir, false)
                    };
                }

                state.isUpdateNodePopUpOpen = false
            })

            /**
             * DeleteNode
             */

            .addCase(deleteFileManagerNode.fulfilled, (state: FileManagerState, action) => {
                const response: {response: {message: string, deleted_ids: string[]}} = action.payload;

                state.currentDir = {
                    ...state.currentDir,
                    children: removeNodeFromArr(state.currentDir?.children, response.deleted_ids) as FileManagerDir[],
                    files: removeNodeFromArr(state.currentDir?.files, response.deleted_ids) as FileManagerFile[],
                }

                state.isDeleteNodePopUpOpen = false
            })


            /**
             * Get Breadcrumbs
             */
            .addCase(getBreadcrumbs.fulfilled, (state: FileManagerState, action) => {
                const { breadcrumbs } = action.payload;

                state.breadcrumbs = breadcrumbs;
            })
    },
});

export const {
    setCurrentDir, setFileManagerTree,
    handleMakeDirPopUp, handleUpdateNodePopUpOpen, handleDeleteNodePopUpOpen,
    setBreadcrumbs,
    handleSelectable, selectNode, clearSelection,
    setNodeToUpdate, setNodeToDelete,
} = fileManagerSlice.actions;
export default fileManagerSlice.reducer;

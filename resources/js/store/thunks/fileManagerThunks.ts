import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FileManagerDir, FileManagerFile } from '@types/file-manager';
import { nanoid } from 'nanoid';

/*
 * Directories
 * */
export const fetchFileManagerDirectoryTree = createAsyncThunk(
    'fileManager/fetchTree',
    async (directoryId: string | null = null, { rejectWithValue }) => {
        try {
            const url = directoryId ? `/api/v1/admin/file-manager/${directoryId}` : '/api/file-manager/';
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to load');
        }
    }
);

export const fetchFileManagerDirectory = createAsyncThunk(
    'fileManager/fetchDirectory',
    async (directoryId: string, { dispatch, rejectWithValue }) => {
        try {
            const url = `/api/v1/admin/file-manager/${directoryId}`;
            const response = await axios.get(url);

            // Fetch breadcrumbs for the current directory
            await dispatch(getBreadcrumbs(directoryId));

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to load');
        }
    }
);

interface CreateDirectoryResponse {
    data: FileManagerDir;
    tempId: string;
    parentId: string | null;
}

export const createFileManagerDirectory = createAsyncThunk<
    CreateDirectoryResponse,
    { name: string; parent_id?: string | null },
    { rejectValue: string }
>(
    'fileManager/createDirectory',
    async ({ name, parent_id = null }, { rejectWithValue }) => {
        const tempId = nanoid();

        try {
            const url = '/api/v1/admin/file-manager';
            const newDirData = {
                name: name,
                parent_id: parent_id,
            };
            const response = await axios.post<{directory: FileManagerDir}>(url, newDirData);

            return {
                data: response.data,
                tempId: tempId,
                parentId: parent_id,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Error creating folder');
        }
    }
);

export const deleteFileManagerNode = createAsyncThunk<
    any,
    (FileManagerDir | FileManagerFile) | (FileManagerDir | FileManagerFile)[],
    { rejectValue: string }
>(
    'fileManager/deleteNode',
    async (nodeToDelete: ((FileManagerDir | FileManagerFile) | (FileManagerDir | FileManagerFile)[]), { rejectWithValue }) => {
        try {
            let url = '/api/v1/admin/file-manager/'
            let response;

            if (!Array.isArray(nodeToDelete)) {
                // Deleting a single node (directory or file)
                url += `${nodeToDelete.id}`;
                response = await axios.delete<any>(url);
            } else {
                // Deleting multiple nodes (directories or files)
                response = await axios.delete<any>(url, {
                    data: {
                        ids: nodeToDelete.map(node => node.id)
                    },
                });
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Deletion error');
        }
    }
);

export const updateFileManagerDirectory = createAsyncThunk<
    FileManagerDir,
    FileManagerDir,
    { rejectValue: string }
>(
    'fileManager/updateDirectory',
    async (directoryToUpdate: FileManagerDir, { rejectWithValue }) => {
        try {
            const url = `/api/v1/admin/file-manager/${directoryToUpdate.id}`;
            // Assuming your backend expects the full directory object for update
            const response = await axios.put<FileManagerDir>(url, directoryToUpdate);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update');
        }
    }
);

/*
 * Files
 * */

interface UploadFilePayload {
    files: File[];
    directoryId: string;
}

interface UploadFileSuccessResponse {
    uploadedFiles: FileManagerFile[];
}

export const uploadFileManagerFile = createAsyncThunk<
    UploadFileSuccessResponse,
    UploadFilePayload,
    { rejectValue: string }
>(
    'fileManager/uploadFile',
    async ({ files, directoryId }, { rejectWithValue }) => {
        console.log('Initiating file upload...'); // Translated from '123123123'
        try {
            const url = `/api/v1/admin/file-manager/file`;

            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            formData.append('directory_id', directoryId);
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
                    console.log(`Upload progress: ${percentCompleted}%`);
                    // You can dispatch an action here to update the UI with progress
                },
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || 'File upload error.');
            }
            return rejectWithValue(error.message || 'An unknown error occurred.');
        }
    }
);


export const updateFileManagerFile = createAsyncThunk(
    'fileManager/updateFile',
    async (file: FileManagerFile, { rejectWithValue }) => {
        try {
            const url = `/api/v1/admin/file-manager/file/${file.id}`;
            // Assuming your backend expects the file object for update
            const response = await axios.put(url, file);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update');
        }
    }
);

/*
 * Breadcrumbs
 * */


export const getBreadcrumbs = createAsyncThunk(
    'fileManager/getBreadcrumbs',
    async (currentDirectoryId: string, { rejectWithValue }) => {
        try {
            const url = `/api/v1/admin/file-manager/breadcrumbs/${currentDirectoryId}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to load');
        }
    }
);

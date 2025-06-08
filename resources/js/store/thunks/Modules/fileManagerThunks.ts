import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FileManagerDir, FileManagerFile } from '@types/Modules/file-manager';
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
            return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка загрузки');
        }
    }
);

export const fetchFileManagerDirectory = createAsyncThunk(
    'fileManager/fetchDirectory',
    async (directoryId: string, { dispatch, rejectWithValue }) => {
        try {
            const url = `/api/v1/admin/file-manager/${directoryId}`;
            const response = await axios.get(url);

            await dispatch(getBreadcrumbs(directoryId));

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка загрузки');
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
            return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка создания папки');
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
            const response = await axios.put<FileManagerDir>(url, directoryToUpdate);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка загрузки');
        }
    }
);

/*
* Files
* */

export const updateFileManagerFile = createAsyncThunk(
    'fileManager/updateFile',
    async (file: FileManagerFile, { rejectWithValue }) => {
        try {
            const url = `/api/v1/admin/file-manager/file/${file.id}`;
            const response = await axios.put(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка загрузки');
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
            return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка загрузки');
        }
    }
);

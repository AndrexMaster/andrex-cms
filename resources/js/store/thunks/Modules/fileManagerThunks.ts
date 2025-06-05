import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FileManagerDir } from '@types/Modules/file-manager';
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
    async (directoryId: string, { rejectWithValue }) => {
        try {
            const url = `/api/v1/admin/file-manager/${directoryId}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка загрузки');
        }
    }
);

// Возвращаем объект, который включает реальные данные и параметры,
// использованные для оптимистичного обновления
interface CreateDirectoryResponse {
    data: FileManagerDir; // Данные, которые пришли с сервера
    tempId: string; // Временный ID, который мы создали
    parentId: string | null; // ID родительской директории
}

export const createFileManagerDirectory = createAsyncThunk<
    CreateDirectoryResponse, // Тип возвращаемого значения (fulfilled.payload)
    { name: string; parent_id?: string | null }, // Тип аргументов thunk'а
    { rejectValue: string } // Тип rejectValue
>(
    'fileManager/createDirectory', // Имя действия, было 'uploadFile'
    async ({ name, parent_id = null }, { rejectWithValue }) => {
        const tempId = nanoid(); // Генерируем временный ID

        try {
            const url = '/api/v1/admin/file-manager';
            const newDirData = {
                name: name,
                parent_id: parent_id,
            };
            const response = await axios.post<FileManagerDir>(url, newDirData); // Ожидаем FileManagerDir от сервера

            return {
                data: response.data, // Реальные данные, пришедшие с сервера (с настоящим ID)
                tempId: tempId,       // Возвращаем временный ID для сопоставления
                parentId: parent_id,  // Возвращаем parent_id для сопоставления
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка создания папки');
        }
    }
);

export const updateFileManagerDirectory = createAsyncThunk(
    'fileManager/uploadFile',
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

/*
* Files
* */

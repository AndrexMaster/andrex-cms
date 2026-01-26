import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '@types/product';

export const getProducts = createAsyncThunk(
    'admin/products/getProducts',
    async (page: number, { rejectWithValue }) => {
        try {
            const url = `/api/v1/admin/products?page=${page ?? 1}`;
            const response = await axios.get(url);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to load');
        }
    }
);
export const getProduct = createAsyncThunk(
    'admin/products/getProduct',
    async (slug: string, { rejectWithValue }) => {
        try {
            const url = `/api/v1/admin/products/${slug}`;
            const response = await axios.get(url);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to load');
        }
    }
);

export const addProduct = createAsyncThunk<
    { product: Product },
    { name: string; parent_id?: string | null },
    { rejectValue: string }
>(
    'admin/products/addProduct',
    async (product, { rejectWithValue }) => {
        try {
            const url = '/api/v1/admin/products';
            const response = await axios.post(url, product);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Error adding product');
        }
    }
);
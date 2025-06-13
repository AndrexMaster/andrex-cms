import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import fileManagerReducer from './slices/fileManagerSlice';

export const store = configureStore({
    reducer: {
        product: productReducer,
        fileManager: fileManagerReducer,
    },
    // devTools: process.env.NODE_ENV !== 'production', // Включает Redux DevTools в разработке
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

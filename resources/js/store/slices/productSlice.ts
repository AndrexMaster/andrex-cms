import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductTemplate } from '@types/product';

interface ProductState {
    product: Product | ProductTemplate;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    product: {
        id: null,
        slug: null,
        title: null,
        description: null,
        photos: [],
        characteristics: [],
    },
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProduct: (state, action: PayloadAction<Product>) => {
            state.product = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            state.product = action.payload;
            state.loading = false;
            state.error = null;
        },


        setProductLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setProductError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },


        // TODO: Сделать запросами на бек
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.push(action.payload);
        },
        deleteProduct: (state, action: PayloadAction<number>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        }
    },
});

export const { setProduct, addProduct, updateProduct, deleteProduct, setProductLoading, setProductError } = productSlice.actions;
export default productSlice.reducer;

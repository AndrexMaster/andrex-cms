import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductTemplate } from '@types/product';
import { addProduct } from '@store/thunks/productThunks';

interface ProductState {
    product: Product | ProductTemplate;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    product: {
        id: undefined,
        slug: '',
        title: '',
        price: 0,
        description: '',
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


        // TODO: Сделать запросом на бек
        deleteProduct: (state, action: PayloadAction<number>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            /**
             * Add product
             */
            .addCase(addProduct.pending, (state: ProductState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state: ProductState, action) => {
                state.loading = false;
                state.error = null;
                state.product = (action.payload as { product: Product }).product;
                window.location.replace(`/admin/products/${action.payload.product.slug}`);
            })
            .addCase(addProduct.rejected, (state: ProductState, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setProduct, updateProduct, deleteProduct, setProductLoading, setProductError } = productSlice.actions;
export default productSlice.reducer;

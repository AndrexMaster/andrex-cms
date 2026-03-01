import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addProductToCart } from '@store/thunks/productThunks';

interface CartState {
    cartItemsCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cartItemsCount: null,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItemsCounter: (state, action) => {
            state.cartItemsCount = action.payload
        },
        decreaseCartItemsCounter: (state) => {
            state.cartItemsCount = state.cartItemsCount--
        },
    },
    extraReducers: (builder) => {
        builder
            /**
             * Add cart
             */
            .addCase(addProductToCart.pending, (state: CartState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductToCart.fulfilled, (state: CartState, action) => {
                state.cartItemsCount += 1

                state.loading = false;
                state.error = null;

            })
            .addCase(addProductToCart.rejected, (state: CartState, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setCartItemsCounter, decreaseCartItemsCounter} = cartSlice.actions;
export default cartSlice.reducer;

import React, { useEffect } from 'react';
import { HeaderMenu } from '@layouts/public/Header/HeaderMenu';
import { usePage } from '@inertiajs/react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCartItemsCounter } from '@store/slices/cartSlice';

export const Header = () => {
    const { props } = usePage();
    const dispatch = useAppDispatch();
    const cartItemsCount = useAppSelector((state) => state.cart.cartItemsCount)

    useEffect(() => {
        dispatch(setCartItemsCounter(props.cartItemsCount))
    }, [dispatch, props.cartItemsCount]);

    return (
        <header className={`flex justify-between border-b border-gray-200/10 px-2`}>
            <div className={'flex-auto'}></div>
            <HeaderMenu className={'flex-1'} />
            <div className={'flex flex-auto items-center justify-end'}>
                <div className={'relative flex cursor-pointer rounded p-2 hover:bg-amber-50/10'}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                    </svg>
                    <div
                        className={
                            'absolute top-0.5 right-0.5 flex h-fit items-center justify-center rounded-xl border-black bg-white text-center text-xs text-black px-1'
                        }
                    >
                        {cartItemsCount}
                    </div>
                </div>
            </div>
        </header>
    );
}
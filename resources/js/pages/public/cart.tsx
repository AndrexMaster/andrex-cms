import React from 'react';
import { Product } from '@types/product';
import { PublicPageLayout } from '@layouts/public/public-page-layout';
import { LaravelPagination } from '@types/global';
import { ProductCard } from '@components/Cards/ProductCard';

type ProductPageProps = {
    products: LaravelPagination<Product>;
}

export default function Cart(props) {
    const {cartItems} = props

    console.log('cartItems.data', cartItems.data);

    return (
        <PublicPageLayout>
            <div className={'flex'}>
                <div className={'max-w-xxl flex flex-1 justify-center gap-4 p-4'}>
                    {cartItems?.data.map((cartItem: {product: Product }) => (
                        <ProductCard product={cartItem.product} />
                    ))}
                </div>
                <div className={'flex-auto'}></div>
            </div>
        </PublicPageLayout>
    );
}

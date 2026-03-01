import React from 'react';
import { Product } from '@types/product';
import { PublicPageLayout } from '@layouts/public/public-page-layout';
import { LaravelPagination } from '@types/global';
import { ProductCard } from '@components/Cards/ProductCard';

type ProductPageProps = {
    products: LaravelPagination<Product>;
}

export default function Products(props: ProductPageProps) {
    const {
        products,
    } = props;

    return (
        <PublicPageLayout>
            <div className={'flex justify-center gap-4 p-4 max-w-xxl'}>
                {products?.data.map((product) => (
                    <ProductCard product={product}/>
                ))}
            </div>
        </PublicPageLayout>
    );
}

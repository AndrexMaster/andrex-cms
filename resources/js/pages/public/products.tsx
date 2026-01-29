import React from 'react';
import { Product } from '@types/product';
import { PublicPageLayout } from '@layouts/public/public-page-layout';
import { LaravelPagination } from '@types/global';
import { Image } from '@components/Image';
import { AButton } from '@components/Buttons';

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
                    <div key={product.id} className={'flex flex-col w-[350px] p-4 rounded-sm border gap-4'}>
                        {product.photos?.length > 0 && (
                            <div className={'flex-1'}>
                                <Image url={`/products/${product.photos[0]?.url}`} alt={product.title} />
                            </div>
                        )}
                        <div className={'flex flex-col flex-1 gap-2'}>
                            <span>{product.title}</span>
                            {product.description.length > 0 && (
                                <span className={'rounded-sm border p-1'}>{product.description}</span>
                            )}
                        </div>
                        <AButton className={'flex-x h-fit mt-auto w-full'}>Buy</AButton>
                    </div>
                ))}
            </div>
        </PublicPageLayout>
    );
}

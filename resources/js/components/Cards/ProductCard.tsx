import React from 'react';
import { Image } from '@components/Image';
import { AButton } from '@components/Buttons';
import { Product } from '@types/product';
import { useAppDispatch } from '@store/hooks';
import { addProductToCart } from '@store/thunks/productThunks';

export const ProductCard = ({ product }: {product: Product }) => {
    const dispatch = useAppDispatch()

    return (
        <div key={product.id} className={'flex w-[350px] flex-col gap-4 rounded-sm border p-4'}>
            {/*{product.photos?.length > 0 && (*/}
            <div className={'flex-1'}>
                {product?.photos?.length > 0 ? (
                    <Image url={`/products/${product.photos[0]?.url}`} alt={product.title} />
                ) : (
                    <Image url={`storage/Gemini_Generated_Image_u1nunmu1nunmu1nu.png`} alt={product.title} />
                )}
            </div>
            {/*)}*/}
            <div className={'flex flex-1 flex-col gap-2'}>
                <span>{product.title}</span>
                {product.description.length > 0 && <span className={'rounded-sm border p-1 mt-auto'}>{product.description}</span>}
            </div>
            <AButton onClick={() => dispatch(addProductToCart({product_id: product.id}))} className={'flex-x mt-auto h-fit w-full'}>Add to cart</AButton>
        </div>
    );
};
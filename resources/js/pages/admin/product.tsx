import React from 'react';
import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';
import { ImageList, ImageModificationContainer } from '@components/Image';
import { ProductMainData } from '@components/adminContent/Product';
import { TextField } from '@components/Fields';
import { useSlugifyString } from '@lib/make-slug';
import { useEffect, useState } from 'react';
import { AutocompleteField } from '@components/Fields/AutocompleteField';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setProduct, updateProduct } from '@store/slices/productSlice';
import useDebounce from '@hooks/use-debounce';
import { Product, ProductPhoto, ProductTemplate } from '@types/product';
import { AButton } from '@components/Buttons';
import { addProduct } from '@store/thunks/productThunks';

type ProductPageProps = {
    product: Product;
}

export default function Pages(props: ProductPageProps) {
    const storedProduct: Product | ProductTemplate = useAppSelector((state) => state.product.product);
    const dispatch = useAppDispatch();

    const [productTitle, setProductTitle] = useState<string>(props?.product?.title ?? storedProduct.title);
    const [productPrice, setProductPrice] = useState<number>(props?.product?.price ?? storedProduct.price);
    const productSlug = useSlugifyString(productTitle);

    const debouncedSearchTerm = useDebounce<string>(productTitle, 500);

    useEffect(() => {

        dispatch(
            updateProduct({
                ...storedProduct,
                title: debouncedSearchTerm,
                slug: productSlug,
                price: productPrice,
            }),
        );
    }, [debouncedSearchTerm, dispatch, productPrice]);

    useEffect(() => {
        if (props.product) {
            dispatch(setProduct(props.product));
        }
    }, [dispatch, props]);

    const addImage = (photos: ProductPhoto[]) => {
        dispatch(
            updateProduct({
                ...storedProduct,
                photos: photos,
            }),
        );
    };

    useEffect(() => {
        if (props?.product) {
            dispatch(setProduct(props.product));
        }
    }, [props]);
    
    const formSubmit = (e) => {
        e.preventDefault();

        dispatch(addProduct(storedProduct))
    }

    const tempArray = [
        // Категории
        {
            id: 1,
            title: 'LOH',
        },
        {
            id: 2,
            title: 'LOH2',
        },
        {
            id: 3,
            title: 'LOH3',
        },
        {
            id: 4,
            title: 'LOH4',
        },
        {
            id: 5,
            title: 'LOH5',
        },
    ];

    return (
        // useSlugifyProductName
        <AppLayout>
            <AdminContentLayout contentActionsVariant={'editing'}>
                <form onSubmit={formSubmit} className={'flex flex-1 flex-col gap-6'}>
                    <div className={'flex flex-row gap-4'}>
                        <TextField
                            title={'Product Title'}
                            placeholder={'Product Title'}
                            defaultValue={productTitle}
                            onChange={(val) => setProductTitle(val)}
                            value={productTitle}
                        />
                        <TextField title={'Product slug'} placeholder={'Product slug'} value={useSlugifyString(productTitle)} disabled={true} />
                    </div>
                    <div className={'flex flex-row gap-4'}>
                        <AutocompleteField
                            isAsync={true}
                            placeholder={'Category name'}
                            title={'Category name'}
                            isLoading={false}
                            searchableList={tempArray}
                        />
                        <TextField
                            title={'Product price'}
                            placeholder={'Product price'}
                            defaultValue={productPrice}
                            value={productPrice}
                            onChange={(val) => setProductPrice(val)}
                            type={'number'}
                        />
                    </div>
                    <hr />
                    <ImageModificationContainer addImage={addImage}>
                        <ImageList maxHeight={150} images={storedProduct.photos} />
                    </ImageModificationContainer>
                    <hr />
                    <ProductMainData />
                    {/*<hr/>*/}
                    {/*<ProductAdditionalData/>*/}
                    <AButton className={'mt-auto'} type={'submit'} color={'success'}>
                        Submit
                    </AButton>
                </form>
            </AdminContentLayout>
        </AppLayout>
    );
}

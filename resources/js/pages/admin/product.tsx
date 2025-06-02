import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';
import { ImageList, ImageModificationContainer } from '@components/Image';
import { ProductMainData } from '@components/adminContent/Product';
import { TextField } from '@components/Fields';
import { useSlugifyProductName } from '@lib/make-slug';
import { useEffect, useState } from 'react';
import { AutocompleteField } from '@components/Fields/AutocompleteField';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setProduct, updateProduct } from '@store/slices/productSlice';
import useDebounce from '@hooks/use-debounce';
import { Product, ProductPhoto } from '@types/product';
import axios from 'axios';

export default function Pages(props) {
    const storedProduct: Product = useAppSelector((state) => state.product.product);
    const dispatch = useAppDispatch()

    const [productTitle, setProductTitle] = useState<string>('')

    const debouncedSearchTerm = useDebounce<string>(productTitle, 500);

    useEffect(() => {
        dispatch(updateProduct({
            ...storedProduct,
            title: debouncedSearchTerm,
        }))
    }, [debouncedSearchTerm, dispatch]);

    useEffect(() => {
        if (props.product) {
            dispatch(setProduct(props.product))
        }
    }, [props]);

    const addImage = (photos: ProductPhoto[]) => {
        dispatch(updateProduct({
            ...storedProduct,
            photos: photos,
        }))
    }


    const tempArray = [ // Категории
        {
            id: 1,
            title: 'LOH'
        },
        {
            id: 2,
            title: 'LOH2'
        },
        {
            id: 3,
            title: 'LOH3'
        },
        {
            id: 4,
            title: 'LOH4'
        },
        {
            id: 5,
            title: 'LOH5'
        },
    ]

    return (

        // useSlugifyProductName
        <AppLayout>
            <AdminContentLayout
                contentActionsVariant={'editing'}
            >
                <div className={'flex flex-col gap-6'}>
                    <div className={'flex flex-row gap-4'}>
                        <TextField
                            title={'Product Title'}
                            placeholder={'Product Title'}
                            defaultValue={''}
                            onChange={(val) => setProductTitle(val)}
                        />
                        <TextField
                            title={'Product slug'}
                            placeholder={'Product slug'}
                            defaultValue={useSlugifyProductName(productTitle)}
                            disabled={true}
                        />
                    </div>
                    <div className={'flex flex-row gap-4'}>
                        <AutocompleteField
                            isAsync={true}
                            placeholder={'Category name'}
                            title={'Category name'}
                            isLoading={false}
                            searchableList={tempArray}
                        />
                    </div>
                    <hr/>
                    <ImageModificationContainer
                        addImage={addImage}
                    >
                        <ImageList maxHeight={150} images={storedProduct.photos}/>
                    </ImageModificationContainer>
                    <hr/>
                    <ProductMainData/>
                    {/*<hr/>*/}
                    {/*<ProductAdditionalData/>*/}
                </div>
            </AdminContentLayout>
        </AppLayout>
    );
}

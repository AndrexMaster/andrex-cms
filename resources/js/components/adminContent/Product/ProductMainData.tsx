import { AutocompleteField, MultilineField, TextField } from '@components/Fields';
import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Product, ProductCharacteristic, ProductCharacteristicKey, ProductCharacteristicTemplate, ProductTemplate } from '@types/product';
import { updateProduct } from '@store/slices/productSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import React from 'react';
import { usePage } from '@inertiajs/react';

export const ProductMainData = () => {
    const page = usePage();
    const storedProduct: Product | ProductTemplate = useAppSelector((state) => state.product.product);
    const dispatch = useAppDispatch();

    const [description, setDescription] = useState<string>(page?.props?.product?.description ?? storedProduct.description);

    const characteristicTemplate: ProductCharacteristicTemplate = {
        id: null,
        position: null,
        characteristicKey: {
            id: null,
            title: null,
        },
        value: null,
    }

    const characteristicKeys: ProductCharacteristicKey[] = [
        {
            id: 1,
            title: 'Процессор',
        },
        {
            id: 2,
            title: 'Видеокарта',
        },
        {
            id: 3,
            title: 'ОЗУ',
        },
    ]

    const tempCharacteristics: ProductCharacteristic[] = [
        {
            id: 1,
            characteristicKey: {
                id: 1,
                title: 'Процессор',
            },
            position: 1,
            value: '4.2ГГц',
        }
    ]

    const [characteristicsList, setCharacteristicsList] = useState<ProductCharacteristic[]>(tempCharacteristics);
    const [characteristicToChange, setCharacteristicToChange] = useState();

    const addNewCharacteristic = () => {
        const newCharacteristic = JSON.parse(JSON.stringify(characteristicTemplate));
        newCharacteristic.id = Date.now();
        newCharacteristic.position = characteristicsList.length + 1;
        newCharacteristic.characteristicKey.id = Date.now();
        newCharacteristic.characteristicKey.title = '';
        newCharacteristic.value = '';

        setCharacteristicsList(prevState => [...prevState, newCharacteristic]);
    }

    const updateCharacteristic = (index, newData) => {
        setCharacteristicsList(prevList =>
            prevList.map((item, i) => i === index ? { ...item, ...newData } : item)
        );
    };

    const removeCharacteristicFromList = () => {
      //
    }

    useEffect(() => {

        dispatch(
            updateProduct({
                ...storedProduct,
                description: description,
            }),
        );
    }, [description, dispatch]);

    return (
        <div className={'flex flex-row gap-4'}>
            {/*<TextField*/}
            {/*    title={'Product name'}*/}
            {/*    placeholder={'Product name'}*/}
            {/*    defaultValue={''}*/}
            {/*/>*/}

            <MultilineField title={'Product name'} placeholder={'Product name'} defaultValue={description} onChange={setDescription} />
            <div className={'flex flex-col gap-6'}>
                <div className={'flex flex-col gap-6'}>
                    {characteristicsList?.map((characteristic, index) => (
                        <div key={characteristic.id ?? index} className={'flex flex-row gap-4'}>
                            <AutocompleteField
                                defaultValue={characteristic.characteristicKey.title}
                                placeholder={'Назва характеристики'}
                                searchableList={[]}
                                title={'Назва характеристики'}
                                allowCreate={true}
                            />
                            <TextField
                                defaultValue={characteristic.value}
                                title={'Значення характеристики'}
                                placeholder={'Значення характеристики'}
                                value={''}
                            />
                        </div>
                    ))}
                </div>
                <div
                    onClick={() => addNewCharacteristic()}
                    className={
                        'flex-1-0 flex cursor-pointer items-center justify-center rounded-sm border bg-[#FFFFFF17] p-1 shadow-lg transition hover:shadow-cyan-50/10'
                    }
                >
                    <Plus size={16} />
                </div>
            </div>
        </div>
    );
}

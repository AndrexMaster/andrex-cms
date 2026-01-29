import React, { FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';
import { CategoryInterface } from '@types/category'
import { AutocompleteField, TextField } from '@components/Fields';
import { useSlugifyString } from '@lib/make-slug';
import { AButton } from '@components/Buttons';
import { router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import log from 'eslint-plugin-react/lib/util/log';

export default function Category({category}: {category: CategoryInterface}) {
    const { data, setData, post, get, reset } = useForm({
        name: '',
        slug: '',
        description: null,
        parent_id: null,
    });

    const slug = useSlugifyString(data.name);
    const [hasBeenChanged, setHasBeenChanged] = useState(false);
    const { props } = usePage();

    useEffect(() => {
        setData('slug', slug);
    }, [slug, setData]);

    useEffect(() => {
        if (category) {
            setData('name', category.name)
            setData('slug', category.slug)
            setData('description', category.description ?? null)
            setData('parent_id', category.parent_id ?? null)
        }
    }, [category, setData]);

    useEffect(() => {
        if (
            category.name !== data.name ||
            category.slug !== data.slug ||
            category.description !== data.description ||
            data.parent_id !== data.parent_id
        ) {
            setHasBeenChanged(true);
        } else {
            setHasBeenChanged(false);
        }
    }, [data, category]);

    useEffect(() => {
        axios.get('../../api/v1/admin/categories').then((e) => {
            console.log('e', e);
        });
    }, [props, data]);

    const tempArray = []

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AppLayout>
            <AdminContentLayout contentActionsVariant={category ? 'editing' : 'creating'}>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className={'flex flex-col gap-6'}>
                        <div className={'flex flex-row gap-4'}>
                            <TextField
                                title={'Category Title'}
                                placeholder={'Category Title'}
                                defaultValue={data.name}
                                onChange={(value) => {
                                    setData('name', value)
                                }}
                                onBlur={() => setData('name', data.name.trim())}
                                value={data.name}
                            />
                            <TextField
                                title={'Category slug'}
                                placeholder={'Category slug'}
                                defaultValue={slug}
                                disabled={true}
                                value={slug}
                            />
                        </div>
                        <div className={'flex flex-row gap-4'}>
                            <AutocompleteField
                                isAsync={true}
                                // title={'Parent Category'}
                                isLoading={false}
                                searchableList={tempArray}
                                onSelect={(value) => setData('parent_id', value.id)}
                            />
                        </div>
                        <hr />
                        {/*<ImageModificationContainer*/}
                        {/*    addImage={addImage}*/}
                        {/*>*/}
                        {/*    <ImageList maxHeight={150} images={storedCategory.photos}/>*/}
                        {/*</ImageModificationContainer>*/}

                        <div className={'flex gap-6'}>
                            <AButton className={'w-full'} type={'submit'}>{(category || hasBeenChanged) ? 'Submit' : 'Update'}</AButton>
                        </div>
                    </div>
                </form>
            </AdminContentLayout>
        </AppLayout>
    );
}

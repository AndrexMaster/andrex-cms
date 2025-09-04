import { AppLayout } from '@layouts/app';
import { AdminTableListLayout } from '@layouts/admin/List';
import { AdminContentLayout } from '@layouts/admin';
import React from 'react';
import { CategoryInterface } from '@types/category';
import { TableListLayoutColumns } from '@types/Tables';

export default function Categories(props) {
    const rows: CategoryInterface[] = props.categories.data;

    const columns: TableListLayoutColumns<keyof CategoryInterface>[] = [
        // {
        //     title: 'Id',
        //     key: 'id',
        //     description: 'Some desc',
        //     is_sortable: false,
        // },
        {
            title: 'Name',
            key: 'name',
            description: 'Some desc',
            is_sortable: false,
        },
        {
            title: 'Slug',
            key: 'slug',
            description: 'Some desc',
            is_sortable: false,
        },
        {
            title: 'Description',
            key: 'description',
            description: 'Some desc',
            is_sortable: false,
        },

    ];
    return (
        <AppLayout>
            <AdminContentLayout>
                <AdminTableListLayout<typeof rows[number]> isLinkedRows={true} columns={columns} rows={rows}/>
            </AdminContentLayout>
        </AppLayout>
    );
}

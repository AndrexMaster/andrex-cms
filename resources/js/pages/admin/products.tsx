import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';
import { AdminTableListLayout } from '@layouts/admin/List';
import { TableListLayoutColumns } from 'resources/js/types/Tables';
import { Product } from '@types/product';

export default function Products(props) {
    const rows: Product[] = props.products.data;

    const columns: TableListLayoutColumns<keyof Product>[] = [
        {
            title: 'Id',
            key: 'id',
            description: 'Some desc',
            is_sortable: false,
        },
        {
            title: 'Title',
            key: 'title',
            description: 'Some desc',
            is_sortable: false,
        },
        {
            title: 'Slug',
            key: 'slug',
            description: 'Some desc',
            is_sortable: false,
        },

    ];

    return (
        <AppLayout>
            <AdminContentLayout>
                <AdminTableListLayout<typeof rows[number]> columns={columns} rows={rows}/>
            </AdminContentLayout>
        </AppLayout>
    );
}

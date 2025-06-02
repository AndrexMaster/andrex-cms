import { AppLayout } from '@layouts/app';
import { type BreadcrumbItem } from '@types/';
import { AdminContentLayout } from '@layouts/admin';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Promotions Management',
        href: '/categories',
    },
];

export default function Promotions() {
    return (
        <AppLayout>
            <AdminContentLayout>
                Promotions
            </AdminContentLayout>
        </AppLayout>
    );
}

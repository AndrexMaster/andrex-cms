import { AppLayout } from '@layouts/app';
import { AdminTableListLayout } from '@layouts/admin/List';
import { AdminContentLayout } from '@layouts/admin';

export default function Categories(props) {
    return (
        <AppLayout>
            <AdminContentLayout>
                <AdminTableListLayout/>
            </AdminContentLayout>
        </AppLayout>
    );
}

import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';

export default function Pages() {
    return (
        <AppLayout>
            <AdminContentLayout>
                Pages
            </AdminContentLayout>
        </AppLayout>
    );
}

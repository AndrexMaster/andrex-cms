import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';

export default function Dashboard() {
    return (
        <AppLayout>
            <AdminContentLayout>
                Dashboard
            </AdminContentLayout>
        </AppLayout>
    );
}

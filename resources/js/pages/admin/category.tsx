import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';

export default function Pages() {

    return (

        // useSlugifyProductName
        <AppLayout>
            <AdminContentLayout
                contentActionsVariant={'editing'}
            >
                New category
            </AdminContentLayout>
        </AppLayout>
    );
}

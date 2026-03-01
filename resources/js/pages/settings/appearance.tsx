import { Head } from '@inertiajs/react';
import { AppLayout } from '@layouts/app';
import React from 'react';
import SettingsLayout from '@layouts/settings/layout';
import { BreadcrumbItem } from '@types/global';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    Appearance bar
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

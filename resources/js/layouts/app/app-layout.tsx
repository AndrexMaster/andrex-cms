import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { getBreadcrumbs } from '@hooks/use-breadcrumbs';

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children, ...props }: AppLayoutProps) => (
    <>
        <Head title={getBreadcrumbs().at(-1)?.title} />
        {children}
    </>
);

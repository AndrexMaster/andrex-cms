import { Head } from '@inertiajs/react';
import { getBreadcrumbs } from '@hooks/use-breadcrumbs';
import React, { ReactNode } from 'react';
import { Header } from '@layouts/public/Header/Header';

type LayoutProps = {
    children: ReactNode;
}

export const PublicPageLayout = (props: LayoutProps) => {
    const { children } = props;

    return (
        <>
            <Head title={getBreadcrumbs().at(-1)?.title} />
            <div className={'flex flex-col w-full'}>
                <Header/>
                {children}
            </div>
        </>
    )
}
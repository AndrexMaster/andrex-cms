import { BreadcrumbItem } from '@types/';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

const staticPages: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin'
    },
    {
        title: 'Products',
        href: '/products/new',
    },
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Pages',
        href: '/pages',
    },
    {
        title: 'Promotions',
        href: '/promotions',
    },
    {
        title: 'File Manager',
        href: '/file-manager'
    }
]

export const getBreadcrumbs = (): BreadcrumbItem[] => {
    const page = usePage()
    const urlParts = page.url.split('/')

    return useMemo(() => {
        let breadcrumbsArr = [];
        urlParts.map(urlPart => {
            staticPages.map(breadcrumb => {
                if (breadcrumb.href === ('/' + urlPart)) {
                    breadcrumbsArr.push(breadcrumb)
                }
            })
        })

        return breadcrumbsArr;
    }, [page])
}

export const getPageTitle = () => {
    return getBreadcrumbs()?.at(-1)?.title
}

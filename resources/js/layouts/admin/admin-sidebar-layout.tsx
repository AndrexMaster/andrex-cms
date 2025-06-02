import { Footer, Header, NavLinks } from '@components/sidebar';
import { BreadcrumbItem } from '@types/index';

const adminNavigationLinks: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
    },
    {
        title: 'Products',
        href: '/admin/products',
    },
    {
        title: 'Categories',
        href: '/admin/categories',
    }
]

const adminBottomNavigationLinks: BreadcrumbItem[] = [
    {
        title: 'File Manager',
        href: '/admin/file-manager'
    }
]

export default function AdminSidebarLayout() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth: '240px',
                flex: '0 1',
                padding: '16px',
                paddingRight: '0',
            }}
        >
            <Header/>
            <hr/>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px',
                    flex: 'auto'
                }}
            >
                <NavLinks links={adminNavigationLinks}/>
                <NavLinks links={adminBottomNavigationLinks}/>
            </div>
            <hr/>
            <Footer/>
        </div>
    );
}

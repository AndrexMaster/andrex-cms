import { JSX, ReactNode } from 'react';
import { PageIcon } from '@components/';
import AdminSidebarLayout from '@layouts/admin/admin-sidebar-layout';
import { getPageTitle } from '@hooks/use-breadcrumbs';
import { AdminContentLayoutActions, AdminContentLayoutActionsProps } from '@components/adminContent';

export interface AdminContentLayoutInterface{
    children: ReactNode;
    contentActions?: ReactNode | JSX;
    contentActionsVariant?: 'editing' | 'creating' | 'browsing';
}

export const AdminContentLayout = (props: AdminContentLayoutInterface) => {
    const {
        children,
        contentActions,
        contentActionsVariant
    } = props

    return (
        <div
            style={{
                display: 'flex',
                gap: '20px',
                padding: '8px',
                flex: 1,
                backgroundColor: '#222',
            }}
        >
            <AdminSidebarLayout {...props} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    borderRadius: '16px',
                    border: '1px solid #555',
                    padding: '16px',
                    flex: '1 0',
                    backgroundColor: '#0e0e0e',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div className={'flex items-center justify-between gap-4'}>
                    <div className={'flex items-center gap-2'}>
                        <PageIcon/>
                        <span>{getPageTitle()}</span>
                    </div>
                    {contentActions ?? <AdminContentLayoutActions variant={contentActionsVariant}/>}
                </div>
                <hr/>
                {children}
            </div>
        </div>
    )
}

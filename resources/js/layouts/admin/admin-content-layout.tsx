import { JSX, ReactNode, useEffect } from 'react';
import { PageIcon } from '@components/';
import AdminSidebarLayout from '@layouts/admin/admin-sidebar-layout';
import { getPageTitle } from '@hooks/use-breadcrumbs';
import { AdminContentLayoutActions } from '@components/adminContent';
import { FileManagerBreadcrumb } from '@types/file-manager';
import { ChevronRight } from 'lucide-react';

export interface AdminContentLayoutInterface{
    children: ReactNode;
    contentActions?: ReactNode | JSX;
    contentActionsVariant?: 'editing' | 'creating' | 'browsing';
    breadcrumbs?: FileManagerBreadcrumb[]
    customBreadcrumbAction?: (data: string) => void;
    customBreadcrumbHeadingAction?: (data: string) => void;
}

export const AdminContentLayout = (props: AdminContentLayoutInterface) => {
    const {
        children,
        contentActions,
        contentActionsVariant,
        breadcrumbs,
        customBreadcrumbAction,
        customBreadcrumbHeadingAction
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
                        <span
                            onClick={() => {
                                customBreadcrumbHeadingAction && breadcrumbs?.length > 1 ?
                                    customBreadcrumbHeadingAction(breadcrumbs[0]['id'])
                                :
                                    null;
                            }
                            }
                            className={(customBreadcrumbHeadingAction && breadcrumbs?.length > 1) ? 'cursor-pointer hover:underline' : ''}
                        >
                            {getPageTitle()}
                        </span>
                        {/* // TODO: Сделать overflow для бредкрамбса*/}
                        {breadcrumbs && breadcrumbs?.length > 0 && (
                            <div
                                className={'flex items-center overflow-x-auto'}
                            >
                                {breadcrumbs?.map((breadcrumb, index) => {
                                    if (index > 0) {
                                        return (
                                            <>
                                                <ChevronRight />
                                                <span
                                                    onClick={() => customBreadcrumbAction ?
                                                            customBreadcrumbAction(breadcrumb.id)
                                                        :
                                                            null
                                                    }
                                                    className={customBreadcrumbAction ? 'cursor-pointer hover:underline' : ''}
                                                >
                                                    {breadcrumb.name}
                                                </span>
                                            </>
                                        )
                                    }
                                })}
                            </div>
                        )}
                    </div>
                    {contentActions ?? <AdminContentLayoutActions variant={contentActionsVariant}/>}
                </div>
                <hr/>
                {children}
            </div>
        </div>
    )
}

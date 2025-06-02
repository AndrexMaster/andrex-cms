import { AButton } from '@components/Buttons';
import { Plus, Trash2, FileDown } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export interface AdminContentLayoutActionsProps {
    variant?: 'editing' | 'creating' | 'browsing'
}

export const AdminContentLayoutActions = (props: AdminContentLayoutActionsProps) => {
    const {
        variant = 'browsing'
    } = props;

    const page = usePage()

    const selectedItemId: string | number | null = null
    const isAbleToImport:  boolean = false

    const creationPageLink = useMemo(() => {
        if (page.url.includes('/new')) return ''

        return page.url + '/new'
    }, [page])

    return (
        <div className={'flex gap-4 items-center flex-row'}>
            <AButton
                type={'link'}
                href={creationPageLink}
                endIcon={<Plus size={18}/>}
            >
                Add
            </AButton>
            {selectedItemId && (
                <AButton endIcon={<Trash2 size={18} />}>Remove</AButton>
            )}
            {isAbleToImport && (
                <AButton endIcon={<FileDown size={18} />}>Import</AButton>
            )}
        </div>
    )
}

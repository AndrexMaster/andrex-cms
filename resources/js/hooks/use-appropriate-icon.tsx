import { Boxes, FolderRoot, LayoutDashboard, Package, PackageOpen, StickyNote } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { ReactNode, useMemo } from 'react';

interface UseAppropriateIconProps {
    url: string;
    size?: 'small' | 'medium' | 'large' | 'xl';
}

export const UseAppropriateIcon = (props: UseAppropriateIconProps): ReactNode => {
    const { url, size } = props;

    const iconSize = useMemo(() => {
        switch (size) {
            case 'small':
                return 16
            case 'medium':
                return 24
            case 'large':
                return 32
            case 'xl':
                return 48
            default:
                return 24
        }
    }, [size])

    const adminPagePersonalIcons = {
        'default': <StickyNote size={iconSize}/>,
        'admin': <LayoutDashboard size={iconSize}/>,
        'products': <Package size={iconSize}/>,
        'products/{product_id}': <PackageOpen size={iconSize}/>,
        'categories': <Boxes size={iconSize}/>,
        'file-manager': <FolderRoot size={iconSize}/>,
    }

    const publicPagePersonalIcons = {
        'default': <StickyNote size={iconSize}/>,
    }

    const isAdminPage = url.includes('admin')

    if (isAdminPage) {
        const iconKey =  url === '/admin' ? 'default' : url.replace('/admin/', '')
        return adminPagePersonalIcons[iconKey] ?? adminPagePersonalIcons['default']
    }

    const iconKey = url.slice(1)
    return publicPagePersonalIcons[iconKey] ?? publicPagePersonalIcons['default']
}

export const PageIcon = () => {
    const page = usePage()

    return (
        <UseAppropriateIcon url={page.url}/>
    )
}



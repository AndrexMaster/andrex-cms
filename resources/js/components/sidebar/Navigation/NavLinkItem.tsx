import { BreadcrumbItem } from '@types/index';
import { Link } from '@inertiajs/react';
import { UseAppropriateIcon } from '@hooks/use-appropriate-icon';

interface NavLinkItemProps {
    link: BreadcrumbItem
    active?: boolean
}

export const NavLinkItem = (props: NavLinkItemProps) => {
    const {
        link,
    } = props;


    return (
        <div>
            <Link
                href={link.href}
                className={'flex gap-2 items-center border-b-1 border-gray-100 p-1 cursor-pointer w-[100%] transition hover:border-gray-500'}
            >
                <UseAppropriateIcon url={link.href} size={'small'}/>
                {link.title}
            </Link>
        </div>
    )
}

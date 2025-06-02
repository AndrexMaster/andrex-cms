import { BreadcrumbItem } from '@types/index';
import { NavLinkItem } from '@components/sidebar/Navigation/NavLinkItem';

interface NavLinksProps {
    links: BreadcrumbItem[]
}

export const NavLinks = (props: NavLinksProps) => {
    const  {
        links,
    } = props


    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '8px 0',
            }}
        >
            {links.map((link, index) => {
                return (
                    <NavLinkItem link={link}/>
                )
            })}
        </div>
    )
}

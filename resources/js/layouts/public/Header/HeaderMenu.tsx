import React from 'react';
import { Link } from '@inertiajs/react';
import { it } from 'node:test';

type HeaderMenuProps = {
    className?: string;
}

export  const HeaderMenu = (props: HeaderMenuProps) => {
    const { className } = props;
    const menuItems = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: 'About',
            href: '/about',
        },
        {
            title: 'Contact',
            href: '/contact',
        },
        {
            title: 'Products',
            href: '/products',
        }
    ]

    return (
        <div className={`${className} flex gap-2 align-middle justify-center`}>
            {menuItems?.map((item, index) => (
                <>
                    <Link
                        key={index}
                        href={item.href}
                        className={`flex items-center ${className} px-2 py-4 text-center justify-center hover:bg-gray-600/10 transition-all duration-300 ease-in-out uppercase border-b border-gray-600/0 hover:border-gray-200/10`}
                    >
                        {item.title}
                    </Link>

                    { menuItems.length !== index + 1 && (
                        <hr key={index + 'a'} className={'h-[80%] w-0.5 bg-gray-200/10 py-4 my-auto'} />
                    )}
                </>
            ))}
        </div>
    );
}
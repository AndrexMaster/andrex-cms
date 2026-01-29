import React from 'react';
import { HeaderMenu } from '@layouts/public/Header/HeaderMenu';

export const Header = () => {

    return (
        <header
            className={`flex justify-between px-2 py-2 border-b border-gray-200/10`}
        >
            <div className={'flex-auto'}></div>
            <HeaderMenu className={'flex-1'}/>
            <div  className={'flex-auto'}></div>
        </header>
    )
}
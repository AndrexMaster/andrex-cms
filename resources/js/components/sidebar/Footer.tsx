import { useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { ChevronDown, Settings } from 'lucide-react';

export const Footer = () => {
    const { auth } = usePage().props;
    const { user } = auth;
    const [isMenuActive, setIsMenuActive] = useState(false);
    const { post } = useForm();


    return (
        <div className={`flex justify-between relative ${isMenuActive ? 'rounded-b-md' : 'rounded-md'} bg-zinc-900 hover:cursor-pointer`}>
            <div className={'flex justify-between items-center relative py-2 px-4 w-full z-1'} onClick={() => setIsMenuActive(!isMenuActive)}>
                <span>{user.name}</span>
                <ChevronDown className={`${isMenuActive ? 'rotate-180' : 'rotate-0'} transition-all duration-300 ease-in-out`}/>
            </div>
            <div className={`${isMenuActive ? 'opacity-100' : 'opacity-0'} translate-y-[-100%] overflow-hidden rounded-t-md flex flex-col gap-3 absolute top-0 left-0 w-full transition-all duration-300 ease-in-out bg-zinc-900`}>
                <div className={'flex flex-col rounded-t-md items-center w-full'}>
                    <div className={'border-b flex items-center gap-2 w-full justify-between p-3 transition-all duration-300 ease-in-out hover:bg-zinc-800'}>
                        <span>Settings</span> <Settings size={'18'}/>
                    </div>
                    <div
                        className={'border-b flex items-center gap-2 w-full justify-between p-3 transition-all duration-300 ease-in-out hover:bg-zinc-800'}
                        onClick={() => {
                            post(route('logout'));
                        }}
                    >
                        <span>Logout</span> <Settings size={'18'}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
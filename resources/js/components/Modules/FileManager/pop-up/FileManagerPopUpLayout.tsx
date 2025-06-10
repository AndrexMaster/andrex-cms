import { JSX, ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface PopUpLayoutProps {
    heading: string;
    variant?: 'info' | 'success' | 'action'
    children: ReactNode | JSX,
    isPopUpOpen?: boolean,
    closeHandler: () => void,
}

export const FileManagerPopUpLayout = (props: PopUpLayoutProps) => {
    const {
        heading = '',
        type = 'action',
        children,
        isPopUpOpen = false,
        closeHandler,
    } = props;
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                closeHandler();
            }
        };

        if (isPopUpOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
    }, [isPopUpOpen]);

    return (
        <div
            ref={popupRef}
            className={`
                absolute h-fit w-fit min-w-80 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
                bg-stone-700/10 backdrop-blur-sm rounded-md
                flex flex-col
                duration-300
                border border-[#555]
                ${isPopUpOpen ? 'visible opacity-100' : 'invisible opacity-0'}
            `}
            click
        >
            <div
                className={'flex justify-between items-center w-full p-4'}
            >
                <span>{heading}</span>
                <X className={'cursor-pointer'} onClick={closeHandler} size={32}/>
            </div>
            <hr className={'border-stone-700'}/>
            <div className={'flex flex-1 px-4 py-6'}>
                {children}
            </div>
        </div>
    )
}

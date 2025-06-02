import { useAppDispatch, useAppSelector } from '@store/hooks';
import { JSX, ReactNode } from 'react';
import { X } from 'lucide-react';
import { handleMakeDirPopUp } from '@store/slices/Modules/fileManagerSlice';

interface PopUpLayoutProps {
    heading: string;
    variant?: 'info' | 'success' | 'action'
    children: ReactNode | JSX,
    isPopUpOpen?: boolean,
}

export const FileManagerPopUpLayout = (props: PopUpLayoutProps) => {
    const {
        heading = '',
        type = 'action',
        children,
        isPopUpOpen = false,
    } = props;

    const dispatch = useAppDispatch()
    const close = () => {
        dispatch(handleMakeDirPopUp(false))
    }

    return (
        <div className={`
                absolute h-fit w-fit left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
                bg-stone-700/10 backdrop-blur-sm rounded-md
                flex flex-col
                duration-300
                ${isPopUpOpen ? 'visible opacity-100' : 'invisible opacity-0'}

            `}
        >
            <div
                className={'flex justify-between w-full p-4'}
            >
                <span>{heading}</span>
                <X className={'cursor-pointer'} onClick={close} size={32}/>
            </div>
            <hr className={'border-stone-700'}/>
            <div className={'flex flex-1 px-4 py-6'}>
                {children}
            </div>
        </div>
    )
}

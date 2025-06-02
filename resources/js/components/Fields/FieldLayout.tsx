import { useEffect, useState } from 'react';
import { DefaultFieldProps } from '@types/fields';

interface FieldLayoutInterface {
    title: string,
    isTitleRaised: boolean;
}

export const FieldLayout = (props: FieldLayoutInterface) => {
    const {
        title = '',
        isTitleRaised = false,
        children,
    } = props;

    const titleStyle = 'left-0 top-0 translate-y-[19%] translate-x-[9%] opacity-0 invisible'
    const titleFocusedStyle = 'top-0 left-0 text-sm translate-y-[-60%] translate-x-[10%] z-1 px-1 opacity-100 visible'

    return (
        <div className={'flex flex-col flex-auto relative'}>
            <label className={`absolute transition duration-300 bg-stone-950/50 backdrop-blur-xs text-[#717171] ${isTitleRaised ? titleFocusedStyle : titleStyle}`}>{title}</label>
            {children}
        </div>
    )
}

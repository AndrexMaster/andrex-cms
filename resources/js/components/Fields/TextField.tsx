import React, { useEffect, useMemo, useState } from 'react';
import { DefaultFieldProps } from '@types/fields';
import { FieldLayout } from '@components/Fields/FieldLayout';

interface TextFieldInterface extends DefaultFieldProps {
    value: string;
}

export const TextField = (props: TextFieldInterface) => {
    const {
        title = '',
        type = 'text',
        value,
        disabled = false,
        placeholder = '',
        className = '',
        onChange,
        onFocus,
        onBlur,
    } = props;

    const [isFocused, setIsFocused] = useState(value?.length > 0);

    const isTitleRaised = useMemo(() => {
        return isFocused || value?.length > 0;
    }, [isFocused, value]);

    useEffect(() => {
        setIsFocused(value?.length > 0);
    }, [value]);


    return (
        <FieldLayout
            title={title}
            isTitleRaised={isTitleRaised}
        >
            <input
                className={`flex bg-[#111] border ${disabled ? 'text-[#717171]' : 'text-current'} rounded-sm px-2 py-1 text-md focus:outline-indigo-600 focus:outline-[1px] focus:outline-solid` + className}
                placeholder={placeholder}
                type={type}
                value={value}
                onFocus={(e) => {
                    setIsFocused(true);
                    onFocus && onFocus(e);
                }}
                onBlur={(e) => {
                    setIsFocused(!!e.target.value);
                    onBlur && onBlur(e);
                }}
                onChange={(e) => {
                    if (!disabled) {
                        onChange && onChange(e.target.value);
                    }
                }}
                disabled={disabled}
            />
        </FieldLayout>
    );
};

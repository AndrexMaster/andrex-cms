import { useEffect, useMemo, useState } from 'react';
import { DefaultFieldProps } from '@types/fields';
import { FieldLayout } from '@components/Fields/FieldLayout';

interface TextFieldInterface extends DefaultFieldProps {

}

export const TextField = (props: TextFieldInterface) => {
    const {
        title = '',
        type = 'text',
        defaultValue = '',
        value,
        disabled = false,
        placeholder = '',
        className = '',
        onChange,
        onFocus,
        onBlur,
    } = props;

    const [inputData, setInputData] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(defaultValue?.length > 0);

    const isTitleRaised = useMemo(() => {
        return isFocused || defaultValue?.length > 0 || inputData.length > 0
    }, [isFocused, defaultValue])

    useEffect(() => {
        setIsFocused(defaultValue.length > 0)
    }, [defaultValue]);

    return (
        <FieldLayout
            title={title}
            isTitleRaised={isTitleRaised}
        >
            <input
                className={`flex bg-[#111] border ${disabled ? 'text-[#717171]' : 'text-current'} rounded-sm px-2 py-1 text-md focus:outline-indigo-600 focus:outline-[1px] focus:outline-solid` + className}
                placeholder={placeholder}
                type={type}
                value={defaultValue}
                onFocus={() => {
                    setIsFocused(true)
                }}
                onBlur={(e) => {
                    setIsFocused(!!e.target.value)
                }}
                onChange={(e) => {
                    setInputData(e.target.value)
                    if (!disabled) {
                        onChange && onChange(e.target.value)
                    }
                }}
                disabled={disabled}
            />
        </FieldLayout>
    )
}

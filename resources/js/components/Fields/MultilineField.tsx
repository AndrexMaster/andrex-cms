import { useMemo, useState } from 'react';
import { DefaultFieldProps } from '@types/fields';
import { FieldLayout } from '@components/Fields';

interface MultilineFieldInterface extends DefaultFieldProps{
    rows?: number;
    cols?: number;
}

export const MultilineField = (props: MultilineFieldInterface) => {
    const {
        title = '',
        rows = 8,
        cols = 2,
        type = 'text',
        defaultValue = '',
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

    return (
        <FieldLayout
            title={title}
            isTitleRaised={isTitleRaised}
        >
            <textarea
                className={'flex bg-[#111] border rounded-sm px-2 py-1 text-md focus:outline-indigo-600 focus:outline-[1px] focus:outline-solid' + className}

                placeholder={placeholder}
                defaultValue={defaultValue}
                type={type}

                rows={rows}
                cols={cols}

                onFocus={() => {
                    setIsFocused(true)
                }}
                onBlur={(e) => {
                    setIsFocused(!!e.target.value)
                }}
                onChange={(e) => {
                    setInputData(e.target.value)
                    onChange && onChange(e.target.value)
                }}
            />
        </FieldLayout>
    )
}

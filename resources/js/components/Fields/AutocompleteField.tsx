import { useEffect, useMemo, useState } from 'react';
import { DefaultFieldProps } from '@types/fields';
import { SearchableItemInterface, searchInArray } from '@lib/';
import { FieldLayout } from '@components/Fields';
import { ListDropper } from '@components/common/';

interface AutocompleteFieldInterface extends DefaultFieldProps{
    searchableList: SearchableItemInterface[];
    isAsync?: boolean;
    isLoading?: boolean;
    allowCreate?: boolean;
    onSelect?: (e: SearchableItemInterface) => void;
}

// TODO: сделать асинхронную подгрузку списка
// TODO: Апи прикол который позволяет добавлять и сохранять список характеристик в базе и скорее всего в редаксе.
export const AutocompleteField = (props: AutocompleteFieldInterface) => {
    const {
        title = '',
        type = 'text',
        defaultValue = '',
        disabled = false,
        placeholder = '',
        className = '',
        onChange,
        onFocus,
        onBlur,
        onSelect,
        searchableList,
        isLoading = false,
        allowCreate = false,
    } = props;

    const [inputData, setInputData] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const [itemsList, setItemsList] = useState(searchableList ?? [])
    const [chosenItem, setChosenItem] = useState<SearchableItemInterface | null>(null);

    const handleDroppedList = () => {
        if (isFocused) {
            setTimeout(() => {
                setIsFocused(!isFocused)
            }, 100)
        } else {
            setIsFocused(!isFocused)
        }
    }

    const isSelectedItemNew = useMemo(() => {
        return chosenItem?.isNew ?? false
    }, [inputData, chosenItem])

    const updateItemsList = () => {
        if (inputData?.length > 0) {
            if (searchInArray(searchableList, inputData).length <= 0 && allowCreate) {
                const newItem: SearchableItemInterface = {
                    id: searchableList?.length > 0 ? Number(searchableList[searchableList?.length - 1].id) + 1 : 0,
                    title: inputData,
                    isNew: true,
                }

                setItemsList([newItem]);
            } else {
                setItemsList(searchInArray(searchableList, inputData))
            }
        } else if (searchableList?.length > 0){
            setItemsList(searchableList)
        }
    }

    const isTitleRaised = useMemo(() => {
        updateItemsList()
        return isFocused || defaultValue?.length > 0 || inputData.length > 0
    }, [isFocused, defaultValue])

    useEffect(() => {
        updateItemsList()
    }, [inputData]);

    const SelectOne = (selectedItem: SearchableItemInterface) => {
        if (selectedItem) {
            updateItemsList()
            setChosenItem(selectedItem)
            setInputData(selectedItem?.title ?? '')
            setChosenItem(selectedItem)
        }
        if (onSelect) onSelect(selectedItem)
    }

    return (
        <FieldLayout
            title={title}
            isTitleRaised={isTitleRaised}
        >
            <input
                className={`${isSelectedItemNew ? 'text-[#000]' : ''}flex bg-[#111] border ${disabled ? 'text-[#717171]' : 'text-current'} rounded-sm px-2 py-1 text-md focus:outline-indigo-600 focus:outline-[1px] focus:outline-solid` + className}
                placeholder={placeholder}
                type={type}
                value={inputData}
                onFocus={() => {
                    handleDroppedList()
                }}
                onBlur={() => {
                    handleDroppedList()
                }}
                onChange={(e) => {
                    setInputData(e.target.value)
                    onChange && onChange(e.target.value)
                }}
                disabled={disabled}
            />
            <ListDropper
                isOpened={isFocused}
                list={itemsList}
                variant={'small'}
                onClick={SelectOne}
                isLoading={isLoading}
            />
        </FieldLayout>
    )
}

import React from 'react';
import { SearchableItemInterface } from '@lib/search-in-array';
import { LoaderCircle } from 'lucide-react';
import { Chip } from '@components/common';

type DroppedListItem = {

} & SearchableItemInterface & {
    [key: string]: string | number
}

interface ListDropperProps {
    variant: 'small';
    list: DroppedListItem[];
    isOpened: boolean;
    onClick?: (e: DroppedListItem) => void
    isLoading?: boolean;
}

export const ListDropper = (props: ListDropperProps) => {
    const {
        variant,
        list,
        isOpened = false,
        onClick,
        isLoading = false,
    } = props;

    const openAnimation = `${isOpened ? 'translate-y-[100%] opacity-100 visible' : 'translate-y-[70%] opacity-0 invisible'}`

    return (
        <div className={`flex flex-col gap-1 absolute z-2 left-0 bottom-0  bg-[#222] p-2 rounded-sm max-w-64 max-h-[200px] overflow-auto transition ${openAnimation}`}>
            <>
                {
                    isLoading ?
                        <LoaderCircle className={'animate-spin'}/>
                    :
                         !isLoading && (!list || list?.length <= 0) ? (
                            <span>
                                List have not items
                            </span>
                            )
                        :
                            list?.map((item, index) => (
                                <React.Fragment key={index}>
                                    {index !== 0 && (<hr className="border-gray-700"/>)}
                                    <div
                                        title={item.title}
                                        className={'flex flex-row gap-2 px-2 py-1 cursor-pointer hover:bg-[#FFFFFF17] rounded-sm'}
                                        onClick={() => !(onClick) || onClick(item)}
                                    >
                                        <span
                                            className={'overflow-hidden text-ellipsis whitespace-normal [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [display:-webkit-box]'}>
                                            {item.title}
                                        </span>
                                        {item.isNew && (
                                            <div className={'flex ml-auto'}>
                                                <Chip title={'New'}/>
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            ))
                }
            </>
        </div>
    )
}

import { ImageContainer, Image, ImageActions } from '@components/Image/index';
import { useEffect, useMemo, useState } from 'react';
import { ImageDataInterface } from '@types/components';

interface ImageListProps {
    images: ImageDataInterface[]
    variant?: 'block' | 'vertical'
    maxHeight?: number;
}

export const ImageList = (props: ImageListProps) => {
    const {
        images = [],
        variant = 'vertical',
        maxHeight
    } = props;

    const [sortedImages, setSortedImages] = useState<ImageDataInterface[]>();

    useEffect(() => {
        if (images && images.length > 0) {
            const newSortedImages = [...images].sort((a, b) => a.position - b.position);
            setSortedImages(newSortedImages);
        } else {
            setSortedImages([]);
        }
    }, [images]);

    const ImageBlockList = () => {

        return (
            'ImageBlockList'
        )
    }

    const ImageVerticalList = () => {
        // Todo: Make drag&drop position changing
        return (
            <div className={`flex flex-col gap-2 overflow-y-auto box-border pr-3` +  (maxHeight ? ` max-h-[${maxHeight}px]` : '')}>
                {sortedImages?.map((imageData, index) => (
                    <div
                        keu={index}
                        className={'flex gap-6 justify-start py-2 px-2 rounded-sm border items-center'}>
                        <ImageContainer
                            key={imageData.id ?? index}
                        >
                            <Image url={imageData?.url ?? imageData?.previewUrl ?? ''} alt={imageData.altText ?? ''} />
                        </ImageContainer>
                        <div>
                            <p>
                                Image alt text: <i>{imageData.altText ?? ''}</i>
                            </p>
                        </div>

                        <div className={'ml-auto'}>
                            <ImageActions/>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    switch (variant) {
        case 'block':
            return  <ImageBlockList/>
        case 'vertical':
            return <ImageVerticalList/>
    }
}

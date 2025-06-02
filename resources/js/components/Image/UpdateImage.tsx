import { ImageContainer } from '@components/Image/index';
import { AButton } from '@components/Buttons';
import { ReactNode, useEffect } from 'react';

interface UpdateImageProps {
    variant?: 'button' | 'block';
    imageRef: ReactNode
}

export const UpdateImage = (props: UpdateImageProps) => {
    const {
        variant = 'block',
        imageRef,
    } = props;

    useEffect(() => {
        console.log('imageRef in "UpdateImage.tsx"', imageRef);
    }, [imageRef])

    switch (variant) {
        case 'block':
            return (
                <ImageContainer>
                    <image
                        src={''}
                    />
                </ImageContainer>
            )
        case 'button':
            return (
                <AButton>
                    Update Image
                </AButton>
            )
    }
}

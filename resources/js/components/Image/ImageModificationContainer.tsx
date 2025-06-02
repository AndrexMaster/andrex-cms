import { ReactNode } from 'react';
import { ImagesContainerActions } from '@components/Image/index';
import { ImageDataInterface } from '@types/components';

interface ImageModificationContainerProps {
    children: ReactNode,
    addImage: (photos: ImageDataInterface[]) => void
}

export const ImageModificationContainer = (props: ImageModificationContainerProps) => {

    const {
        children,
        addImage
    } = props;

    return (
        <div className={'flex flex-col gap-2'}>
            <div className={'ml-auto'}>
                <ImagesContainerActions addImage={addImage}/>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

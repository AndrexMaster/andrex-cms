import { AddImage } from '@components/Image/AddImage';
import { ImageDataInterface } from '@types/components';

interface ImagesContainerActionsProps {
    className?: string;
    addImage: (photos: ImageDataInterface[]) => void
}

export const ImagesContainerActions = (props: ImagesContainerActionsProps) => {
    const {
        className,
        addImage
    } = props;

    return (
        <div className={className ?? 'flex flex-row gap-2 items-center justify-start'}>
            <AddImage addImage={addImage}/>
        </div>
    )
}

import { ImageProps } from '@types/components';


export const Image = (props: ImageProps) => {
    const {
        alt,
        url,
    } = props;

    return (
        <img
            src={url}
            alt={alt}
            className={'flex-1'}
        />
    )
}

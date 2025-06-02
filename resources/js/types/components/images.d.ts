export type ImageDataInterface = {
    id: number;
    url: string;
    previewUrl?: string;
    altText: string;
    position: number;
}

export interface ImageProps {
    url: string;
    alt: string;
}

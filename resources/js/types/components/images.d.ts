export type ImageDataInterface = {
    id: number;
    path_original: string;
    path_medium: string;
    path_thumbnail: string;
    url_original: string;
    url_medium: string;
    url_thumbnail: string;
    previewUrl?: string;
    altText: string;
    position: number;
}

export interface ImageProps {
    url: string;
    alt: string;
}

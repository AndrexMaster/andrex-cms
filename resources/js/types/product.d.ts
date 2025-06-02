export type Product = {
    id: number;
    slug: string;
    title: string;
    description: string;
    photos: ProductPhoto[];
    characteristics: ProductCharacteristic[];
}
export type ProductCharacteristicKey = {
    id: number;
    title: string;
}

export type ProductCharacteristic = {
    id: number;
    position: number;
    characteristicKey: ProductCharacteristicKey;
    value: string;
}

export type ProductPhoto = {
    id: number;
    url: string;
    previewUrl?: string;
    altText: string;
    position: number;
    // metaTags?: string[];
}


// Templates

export type ProductTemplate = {
    id: null;
    slug: null;
    title: null;
    description: null;
    photos: ProductPhoto[] | null;
    characteristics: ProductCharacteristicTemplate[] | null;
}


export type ProductCharacteristicKeyTemplate = {
    id: null;
    title: null;
}

export type ProductCharacteristicTemplate = {
    id: null;
    position: null;
    characteristicKey: ProductCharacteristicKeyTemplate;
    value: null;
}

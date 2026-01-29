export type CategoryInterface = {
    id: number;
    slug: string;
    name: string;
    parent_id?: number;
    description?: string;
    photos: CategoryPhoto[];
    characteristics: CategoryCharacteristic[];
}

// Templates

export type CategoryTemplate = {
    id: null;
    slug: null;
    name: null;
    description: null;
    photos: CategoryPhoto[] | null;
    characteristics: CategoryCharacteristicTemplate[] | null;
}


export type CategoryCharacteristicKeyTemplate = {
    id: null;
    name: null;
}

export type CategoryCharacteristicTemplate = {
    id: null;
    position: null;
    characteristicKey: CategoryCharacteristicKeyTemplate;
    value: null;
}

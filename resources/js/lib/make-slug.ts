import { useCallback } from 'react';

interface SlugifyOptions {
    separator?: string;
    lower?: boolean;
}

const slugify = (text: string, options: SlugifyOptions = {}): string => {
    const { separator = '-', lower = true } = options;

    if (!text) {
        return '';
    }

    const transliterationMap: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh',
        'з': 'z', 'и': 'y', 'ы': 'y', 'і': 'i', 'ї': 'yi', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'H', 'Ґ': 'G', 'Д': 'D', 'Е': 'E', 'Є': 'Ye', 'Ж': 'Zh',
        'З': 'Z', 'И': 'Y', 'І': 'I', 'Ї': 'Yi', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
        'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
        'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ь': '', 'Ю': 'Yu', 'Я': 'Ya',
        'ё': 'yo', 'Ё': 'Yo',
    };

    let slug = text.replace(/[^\w\sа-яіїєґА-ЯІЇЄҐ-]/gi, '')
        .replace(/\s+/g, separator);

    // Transliteration
    slug = slug.split('').map(char => transliterationMap[char] || char).join('');

    if (lower) {
        slug = slug.toLowerCase();
    }

    return slug;
};

export const useSlugifyString = (str: string, options: SlugifyOptions = {}): string => {
    return useCallback(() => slugify(str, options), [str, options])();
};

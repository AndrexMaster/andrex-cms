export type SearchableItemInterface = {
    id: number;
    title: string;
    isNew?: boolean;
} & {
    [key: string]: any;
}

interface SearchOptions {
    caseSensitive?: boolean;
    searchKey?: 'value' | 'title';
}

/**
 * Function for searching matches in an array of objects.
 * @param {SearchableItemInterface[]} dataArray - The array of objects to search within.
 * @param {string} searchTerm - The string to search for.
 * @param {SearchOptions} [options] - Additional search options.
 * @returns {SearchableItemInterface[]} - An array of objects that match the search query.
 */

// TODO: Use library

export const searchInArray = (
    dataArray: SearchableItemInterface[],
    searchTerm: string,
    options: SearchOptions = {}
): SearchableItemInterface[] => {
    const {
        caseSensitive = false,
        searchKey = 'title'
    } = options;

    if (!searchTerm || !dataArray) {
        return [];
    }

    const normalizedSearchTerm = caseSensitive ? searchTerm : searchTerm.toLowerCase();

    return dataArray.filter(item => {
        const itemValue = item[searchKey];

        if (typeof itemValue === 'string') {
            const normalizedItemValue = caseSensitive ? itemValue : itemValue.toLowerCase();
            return normalizedItemValue.includes(normalizedSearchTerm);
        }

        return false;
    });
};

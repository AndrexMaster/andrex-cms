import { FileManagerDir, FileManagerTree } from '@types/Modules/file-manager';

/**
 * Добавляет новую директорию в древо.
 * @param tree Текущее древо директорий.
 * @param newDir Объект новой директории.
 * @param parentId ID родительской директории (null для корневых).
 * @returns Новое древо с добавленной директорией.
 */
export const addDirectoryToTree = (
    tree: FileManagerTree,
    newDir: FileManagerDir,
    parentId: string | null
): FileManagerTree => {
    if (parentId === null) {
        // Добавляем в корень, если parentId null
        return [...tree, newDir];
    }

    return tree.map(dir => {
        if (dir.id === parentId) {
            // Нашли родителя, добавляем в его children
            return {
                ...dir,
                children: [...(dir.children || []), newDir]
            };
        } else if (dir.children && dir.children.length > 0) {
            // Рекурсивно ищем среди детей
            return {
                ...dir,
                children: addDirectoryToTree(dir.children, newDir, parentId)
            };
        }
        return dir; // Возвращаем директорию как есть, если не родитель
    });
};

/**
 * Обновляет директорию в древе (например, заменяет оптимистичную на реальную).
 * Оптимистичная директория это папка добавленная в ui до получения подтверждения
 * @param tree Текущее древо директорий.
 * @param idToFind ID (tempId или реальный) директории, которую нужно найти.
 * @param updatedDirData Новые данные директории.
 * @param useTempId Использовать ли tempId для поиска.
 * @returns Новое древо с обновленной директорией.
 */
export const updateDirectoryInTree = (
    tree: FileManagerTree,
    idToFind: string,
    updatedDirData: FileManagerDir,
    useTempId: boolean = true
): FileManagerTree => {
    return tree.map(dir => {
        const matchesId = useTempId ? (dir.tempId === idToFind) : (dir.id === idToFind);

        if (matchesId) {
            return {
                ...updatedDirData,
                isOptimistic: false,
                tempId: undefined,
                children: updatedDirData.children || dir.children,
                files: updatedDirData.files || dir.files,
            };
        } else if (dir.children && dir.children.length > 0) {
            // Рекурсивно ищем среди детей
            return {
                ...dir,
                children: updateDirectoryInTree(dir.children, idToFind, updatedDirData, useTempId)
            };
        }
        return dir;
    });
};

/**
 * Удаляет директорию из древа.
 * @param tree Текущее древо директорий.
 * @param idToRemove ID (tempId или реальный) директории, которую нужно удалить.
 * @param useTempId Использовать ли tempId для поиска.
 * @returns Новое древо без удаленной директории.
 */
export const removeDirectoryFromTree = (
    tree: FileManagerTree,
    idToRemove: string,
    useTempId: boolean = true
): FileManagerTree => {
    console.log('tree', tree);
    const filteredTree = tree.filter(dir => {
        const matchesId = useTempId ? (dir.tempId === idToRemove) : (dir.id === idToRemove);
        return !matchesId;
    });

    return filteredTree.map(dir => {
        if (dir.children && dir.children.length > 0) {
            return {
                ...dir,
                children: removeDirectoryFromTree(dir.children, idToRemove, useTempId)
            };
        }
        return dir;
    });
};

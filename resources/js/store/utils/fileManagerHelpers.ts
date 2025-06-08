import { FileManagerDir, FileManagerFile, FileManagerTree } from '@types/Modules/file-manager';
import { current } from '@reduxjs/toolkit';

function isDirectory(item: FileManagerDir | FileManagerFile): item is FileManagerDir {
    return 'children' in item && Array.isArray(item.children);
}

/**
 * Добавляет новую директорию в древо.
 * @param currentChildren Дети текущей директории.
 * @param newDir Объект новой директории.
 * @param parentId ID родительской директории (null для корневых).
 * @returns Новое новый currentDir с добавленной директорией.
 */
export const addDirectoryToCurrent = (
    currentChildren: FileManagerDir,
    newDir: FileManagerDir,
    parentId: string | null
): FileManagerDir[] => {
    if (parentId === null) {
        return [...currentChildren, newDir];
    }

    if (currentChildren.id === parentId) {
        return [...currentChildren.children, newDir]
    }

    return currentChildren.children.map(item => {
        if (isDirectory(item)) {
            if (item.id === parentId) {
                return {
                    ...item,
                    children: [...item.children, newDir]
                };
            } else {
                const updatedChildren = addDirectoryToCurrent(item, newDir, parentId);

                if (updatedChildren !== item.children) {
                    return {
                        ...item,
                        children: updatedChildren as FileManagerDir[] // <--- Приведение типа
                    };
                }
            }
        }
        return item;
    });
};

/**
 * Обновляет директорию в древе (например, заменяет оптимистичную на реальную).
 * Оптимистичная директория это папка добавленная в ui до получения подтверждения
 * @param currentChildren Дети текущей директории.
 * @param idToFind ID (tempId или реальный) директории, которую нужно найти.
 * @param updatedDirData Новые данные директории.
 * @param useTempId Использовать ли tempId для поиска.
 * @returns Новое древо с обновленной директорией.
 */
export const updateDirectoryInCurrent = (
    currentChildren: FileManagerDir,
    idToFind: string,
    updatedDirData: FileManagerDir,
    useTempId: boolean = true
): FileManagerDir[] => {
    return currentChildren.children.map(dir => {
        console.log(`isDirectory(dir) ${dir.name} `, isDirectory(dir));
        if (isDirectory(dir)) {
            const matchesId = useTempId ? (dir?.tempId === idToFind) : (dir.id === idToFind);
            console.log('useTempId', useTempId);
            console.log('dir', current(dir));
            console.log('idToFind', idToFind);
            console.log('matchesId ===', matchesId);
            console.log('updatedDirData', updatedDirData);

            if (matchesId) {
                return {
                    ...updatedDirData,
                    isOptimistic: false,
                    tempId: undefined,
                    children: updatedDirData.children || dir.children,
                    files: updatedDirData.files || dir.files,
                };
            } else if (dir.children && dir.children.length > 0) {
                const updatedChildren = updateDirectoryInCurrent(dir, idToFind, updatedDirData, useTempId)

                if (updatedChildren !== dir.children) {
                    return {
                        ...dir,
                        children: updatedChildren as FileManagerDir[] // <--- Приведение типа
                    };
                }
            }
        }
        return dir;
    });
};

/**
 * Удаляет директорию из древа.
 * @param currentChildren Дети текущей директории.
 * @param idToRemove ID (tempId или реальный) директории, которую нужно удалить.
 * @param useTempId Использовать ли tempId для поиска.
 * @returns Новое древо без удаленной директории.
 */
export const removeDirectoryFromCurrent = (
    currentChildren: FileManagerDir,
    idToRemove: string,
    useTempId: boolean = true
): FileManagerDir[] => {
    const filteredItems = currentChildren.children.filter(item => {
        const targetId = useTempId ? item.tempId : item.id;
        return targetId !== idToRemove;
    });

    return filteredItems.map(item => {
        if (isDirectory(item)) {
            const updatedChildren = removeDirectoryFromCurrent(
                item as FileManagerDir,
                idToRemove,
                useTempId
            );

            if (updatedChildren !== item.children) {
                return {
                    ...item,
                    children: updatedChildren as FileManagerDir[]
                };
            }
        }
        return item;
    });
};


/**
 * Зеркалит значение isSelected если оно существует. В противном случае делает его true
 * @param currentChildren Дети текущей директории.
 * @param idToFind ID (tempId или реальный) директории, которую нужно удалить.
 * @returns FileManagerDir[]
 */


export  const handleNodeSelectionHelper = (
    currentChildren: (FileManagerDir | FileManagerFile)[],
    idToFind: string
) => {
    return currentChildren.map(item => {
        if (item.id === idToFind) {
            return {
                ...item,
                isSelected: item.isSelected !== undefined ? !item.isSelected : idToFind === item.id
            }
        }

        return item
    })
}

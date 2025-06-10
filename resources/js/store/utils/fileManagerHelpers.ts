import { FileManagerDir, FileManagerFile } from '@types/Modules/file-manager';
import { current } from '@reduxjs/toolkit';

function isDirectory(item: FileManagerDir | FileManagerFile): item is FileManagerDir {
    return 'children' in item && Array.isArray(item.children);
}

/**
 * Adds a new directory to the tree.
 * @param currentChildren The children of the current directory.
 * @param newDir The new directory object.
 * @param parentId The ID of the parent directory (null for root directories).
 * @returns A new currentDir with the added directory.
 */
export const addDirectoryToCurrent = (
    currentChildren: FileManagerDir,
    newDir: FileManagerDir,
    parentId: string | null
): FileManagerDir[] => {
    if (currentChildren.id === parentId) {
        return [...currentChildren.children, newDir];
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
                        children: updatedChildren as FileManagerDir[]
                    };
                }
            }
        }
        return item;
    });
};

/**
 * Updates a directory in the tree (e.g., replaces an optimistic one with real data).
 * An optimistic directory is a folder added to the UI before receiving backend confirmation.
 * @param currentChildren The children of the current directory.
 * @param idToFind The ID (tempId or real ID) of the directory to find.
 * @param updatedDirData The new directory data.
 * @param useTempId Whether to use tempId for searching.
 * @returns The new tree with the updated directory.
 */
export const updateDirectoryInCurrent = (
    currentChildren: FileManagerDir,
    idToFind: string,
    updatedDirData: FileManagerDir,
    useTempId: boolean = true
): FileManagerDir[] => {
    return currentChildren.children.map(dir => {
        if (isDirectory(dir)) {
            const matchesId = useTempId ? (dir?.tempId === idToFind) : (dir.id === idToFind);

            if (matchesId) {
                return {
                    ...updatedDirData,
                    isOptimistic: false,
                    tempId: undefined,
                    children: updatedDirData.children || dir.children,
                    files: updatedDirData.files || dir.files,
                };
            } else if (dir.children && dir.children.length > 0) {
                const updatedChildren = updateDirectoryInCurrent(dir, idToFind, updatedDirData, useTempId);

                if (updatedChildren !== dir.children) {
                    return {
                        ...dir,
                        children: updatedChildren as FileManagerDir[]
                    };
                }
            }
        }
        return dir;
    });
};

/**
 * Removes a directory or file from an array of nodes.
 * @param currentDirArray The current array of directories or files.
 * @param idsToRemove IDs of directories or files to remove.
 * @returns A new array without the removed nodes.
 */
export const removeNodeFromArr = (
    currentDirArray: FileManagerDir[] | FileManagerFile[],
    idsToRemove: string[],
): FileManagerDir[] | FileManagerFile[] => {
    return currentDirArray.filter(item => !idsToRemove.includes(item.id));
};


/**
 * Toggles the 'isSelected' value if it exists. Otherwise, sets it to true.
 * @param currentChildren The children of the current directory.
 * @param idToFind The ID (tempId or real ID) of the node to select/deselect.
 * @returns An array of FileManagerDir or FileManagerFile with updated selection.
 */
export  const handleNodeSelectionHelper = (
    currentChildren: (FileManagerDir | FileManagerFile)[],
    idToFind: string
) => {
    return currentChildren.map(item => {
        if (item.id === idToFind) {
            return {
                ...item,
                isSelected: item.isSelected !== undefined ? !item.isSelected : true
            }
        }

        return item
    })
}

/**
 * Sets the 'isSelected' value to false for all items.
 * @param currentChildren The children of the current directory.
 * @returns An array of FileManagerDir or FileManagerFile with all items unselected.
 */
export  const handleNodeUnelectionHelper = (
    currentChildren: (FileManagerDir | FileManagerFile)[],
) => {
    return currentChildren.map(item => {
        return {
            ...item,
            isSelected: false
        }
    })
}

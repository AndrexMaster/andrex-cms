export type FileManagerTree = (FileManagerDir | FileManagerFile)[]

export type FileManagerDir = DefaultNodeTypes & {
    parent_id: string; // Null only in root directory which count is 1
    created_at: string;
    updated_at: string;
    files: FileManagerFile[];
    children: FileManagerDir[];
}

export type FileManagerFile = DefaultNodeTypes & {
    directory_id: string;
    size: number;
    path: string;
    url: string;
    mime_type: string;
    author_id?: string; // User uuid
    last_modified_by: string; // User uuid
    upload_date: string;
    last_modified_date: string;
}

export type FileManagerBreadcrumb = {
    id: string;
    name: string;
}

export type DefaultNodeTypes = {
    id: string;
    name: string;
    tempId?: string;
    isOptimistic?: boolean;
    isSelected?: boolean;
}

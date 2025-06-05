export type FileManagerTree = (FileManagerDir | FileManagerFile)[]

export type FileManagerDir = {
    id: string;
    name: string;
    parent_id: string; // Null only in root directory which count is 1
    created_at: string;
    updated_at: string;
    files: FileManagerFile[];
    children: FileManagerDir[];
    tempId?: string;
    isOptimistic?: boolean;
}

export type FileManagerFile = {
    id: string;
    directory_id: string;
    name: string;
    size: number;
    path: string;
    url: string;
    mime_type: string;
    author_id?: string; // User uuid
    last_modified_by: string; // User uuid
    upload_date: string;
    last_modified_date: string;
    tempId?: string;
    isOptimistic?: boolean;
}

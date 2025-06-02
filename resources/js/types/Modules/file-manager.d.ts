export type FileManagerTree = FileManagerDir[] & { }

export type FileManagerDir = {
    id: string;
    name: string;
    parent_id: string | null;
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
}

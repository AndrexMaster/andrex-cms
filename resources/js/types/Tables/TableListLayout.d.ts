export interface TableListLayoutProps<Row extends TableListLayoutRows> {
    columns: TableListLayoutColumns<keyof Row>[];
    rows: Row[];
}

export type TableListLayoutColumns<Key extends string | number | symbol> = {
    title: string;
    description: string;
    is_sortable: boolean;
} & {
    key: Key;
}

export interface TableListLayoutRows {
    id: string | number;
    [key: string]: any
}

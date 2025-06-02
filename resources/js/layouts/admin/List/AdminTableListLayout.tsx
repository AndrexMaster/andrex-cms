import React from 'react';
import { TableListLayoutProps, TableListLayoutRows, TableListLayoutColumns } from 'resources/js/types/Tables';

interface Props<Row extends TableListLayoutRows> {
    columns: TableListLayoutColumns<keyof Row>[];
    rows: Row[];
}

export const AdminTableListLayout = <Row extends TableListLayoutRows>(props: Props<Row>) => {
    const { columns, rows } = props;

    return (
        <table>
            <thead>
            <tr>
                {columns?.map((column, columnIndex) => (
                    <th key={columnIndex}>{column.title}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {rows?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {columns?.map((column, columnIndex) => (
                        <td key={`${rowIndex}-${columnIndex}`}>{row[column.key]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
            <tfoot></tfoot>
        </table>
    );
};

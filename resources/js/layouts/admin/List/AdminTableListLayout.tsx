import React from 'react';
import { TableListLayoutProps, TableListLayoutRows, TableListLayoutColumns } from 'resources/js/types/Tables';
import { router, usePage } from '@inertiajs/react';

interface Props<Row extends TableListLayoutRows> {
    columns: TableListLayoutColumns<keyof Row>[];
    rows: Row[];
    isLinkedRows?: boolean;
}

export const AdminTableListLayout = <Row extends TableListLayoutRows>(props: Props<Row>) => {
    const { columns, rows, isLinkedRows } = props;
    const pageProps = usePage();

    console.log('pageProps', pageProps.props.ziggy.location);

    return (
        <div className={'border p-2 rounded-md overflow-hidden shadow-sm'}>
            <table className={'w-full'}>
                <thead className={'border-b'}>
                    <tr>
                        {columns?.map((column, columnIndex) => (
                            <th className={'p-2 pt-0'} key={columnIndex}>{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={'text-center'}>
                    {rows?.map((row, rowIndex) => (
                        <tr
                            className={'cursor-pointer'}
                            onClick={() => {
                                if (isLinkedRows) {
                                    router.visit(pageProps?.props?.ziggy?.location + '/' + row?.slug)
                                }
                            }}
                            key={rowIndex}
                        >
                            {columns?.map((column, columnIndex) => (
                                <td className={'p-2'} key={`${rowIndex}-${columnIndex}`}>{row[column.key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot></tfoot>
            </table>
        </div>
    );
};

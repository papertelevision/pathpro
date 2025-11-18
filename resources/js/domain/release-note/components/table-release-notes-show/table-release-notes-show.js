/**
 * External dependencies
 */
import React, { useMemo, Fragment } from 'react';
import { useTable, useRowSelect } from 'react-table';

/**
 * Internal dependencies
 */
import Table from '@app/components/table/table';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import { dateFormat } from '@app/lib/date-format';

const TableReleaseNotesShow = ({ releaseNote }) => {
    const data = useMemo(
        () =>
            releaseNote
                ? [
                      {
                          id: releaseNote?.id,
                          submitter: releaseNote.author,
                          date: dateFormat(
                              releaseNote?.created_at,
                              releaseNote?.project.date_format,
                              true
                          ),
                          title: releaseNote?.title,
                          project: releaseNote?.project.title,
                          project_id: releaseNote?.project.id,
                          status: releaseNote?.status,
                      },
                  ]
                : [],
        [releaseNote]
    );

    const columns = useMemo(
        () => [
            {
                Header: 'Submitted by',
                accessor: 'submitter',
                width: '50%',
            },
            {
                Header: 'For Project/Goal',
                accessor: 'project',
                width: '30%',
            },
            {
                Header: 'Status ',
                accessor: 'status',
                width: '20%',
            },
        ],
        [data]
    );

    const { getTableProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
        useRowSelect
    );

    return (
        <div className="table-overflow">
            <div className="table-overflow__inner">
                <Table {...getTableProps()} className="table--single-record">
                    <Table.Header>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => {
                                    return (
                                        <th
                                            {...column.getHeaderProps()}
                                            style={{ width: column.width }}
                                        >
                                            {column.render('Header')}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                        <tr></tr>
                    </Table.Header>
                    <Table.Body>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className={cell.column.id}
                                            >
                                                {cell.column.id ===
                                                'submitter' ? (
                                                    <Fragment>
                                                        <span className="author">
                                                            <TooltipUserAvatar
                                                                user={
                                                                    row.original
                                                                        .submitter
                                                                }
                                                                projectSlug={
                                                                    releaseNote
                                                                        .project
                                                                        .slug
                                                                }
                                                            />
                                                        </span>
                                                        <span className="date">
                                                            {row.original.date}
                                                        </span>
                                                    </Fragment>
                                                ) : cell.column.id ===
                                                  'status' ? (
                                                    row.original.status ===
                                                    'NEW' ? (
                                                        <span className="is-green">
                                                            {cell.render(
                                                                'Cell'
                                                            )}
                                                        </span>
                                                    ) : row.original.status ===
                                                      'Denied' ? (
                                                        <span className="is-red">
                                                            {cell.render(
                                                                'Cell'
                                                            )}
                                                        </span>
                                                    ) : (
                                                        cell.render('Cell')
                                                    )
                                                ) : (
                                                    cell.render('Cell')
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
};

export default TableReleaseNotesShow;

/**
 * External dependencies
 */
import React, { useMemo } from 'react';
import { useTable, useRowSelect } from 'react-table';
import { NavLink } from 'react-router-dom';
import { startCase, upperCase } from 'lodash';

/**
 * Internal dependencies
 */
import Table from '@app/components/table/table';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import { dateFormat } from '@app/lib/date-format';

const TableSubmissionShow = ({ project, submission }) => {
    const data = useMemo(
        () =>
            submission
                ? [
                      {
                          id: submission?.id,
                          submitter: submission?.author,
                          date: dateFormat(
                              submission?.created_at,
                              project.date_format,
                              true
                          ),
                          title: submission?.title,
                          project: project.title,
                          status:
                              submission?.status === null
                                  ? 'No Status Applied'
                                  : submission?.status,
                      },
                  ]
                : [],
        [submission]
    );

    const columns = useMemo(
        () => [
            {
                Header: 'Submitted by:',
                accessor: 'submitter',
                width: '45%',
            },
            {
                Header: 'For Project/Goal:',
                accessor: 'project',
                width: '27%',
            },
            {
                Header: 'Status:',
                accessor: 'status',
                width: '22%',
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
                                    {row.cells.map((cell) => (
                                        <td
                                            {...cell.getCellProps()}
                                            className={cell.column.id}
                                        >
                                            {cell.column.id === 'submitter' ? (
                                                <>
                                                    <TooltipUserAvatar
                                                        user={
                                                            row.original
                                                                .submitter
                                                        }
                                                        projectSlug={
                                                            project.slug
                                                        }
                                                    />
                                                    <span className="date">
                                                        {row.original.date}
                                                    </span>
                                                </>
                                            ) : cell.column.id === 'status' ? (
                                                row.original.status ===
                                                'new' ? (
                                                    <span className="is-green">
                                                        {upperCase(
                                                            row.original.status
                                                        )}
                                                    </span>
                                                ) : row.original.status ===
                                                  'denied' ? (
                                                    <span className="is-red">
                                                        {startCase(
                                                            row.original.status
                                                        )}
                                                    </span>
                                                ) : (
                                                    startCase(
                                                        row.original.status
                                                    )
                                                )
                                            ) : (
                                                <NavLink
                                                    to="/"
                                                    target="_blank"
                                                    end
                                                >
                                                    {project.title}
                                                </NavLink>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
};

export default TableSubmissionShow;

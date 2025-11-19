/**
 * External dependencies
 */
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { useTable, useRowSelect, usePagination } from 'react-table';
import { NavLink } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Table from '@app/components/table/table';
import BoxButton from '@app/components/box/box-button';
import Dots from '@app/components/dots/dots';
import TableCheckbox from '@app/components/table/table-checkbox';
import TablePagination from '@app/components/table/table-pagination';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import BulkActionsSelect from '@app/components/bulk-actions-select/bulk-actions-select';
import AlertBox from '@app/components/alert-box/alert-box';
import useProjectBannedMembersBulkUpdateMutation from '@app/data/project/use-project-banned-members-bulk-update-mutation';
import useProjectBannedMemberUpdateMutation from '@app/data/project/use-project-banned-member-update-mutation';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TableBannedMembers = ({ members, setCurrentTablePage }) => {
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [alertBoxAction, setAlertBoxAction] = useState();
    const [selectedRowsItemsIDs, setSelectedRowsItemsIDs] = useState([]);
    const [isAnyCheckBoxChecked, setIsAnyCheckBoxChecked] = useState(false);

    const { mutate: mutateMembersBulkUpdate } =
        useProjectBannedMembersBulkUpdateMutation(projectSlug);
    const { mutate: mutateMemberUpdate } =
        useProjectBannedMemberUpdateMutation(projectSlug);

    const handleBulkActionOperation = (values) => {
        setSelectedRowsItemsIDs(values);

        setAlertBoxAction(
            () => () =>
                mutateMembersBulkUpdate(
                    {
                        members: values,
                    },
                    {
                        onSuccess: () => setOpenAlertBox(false),
                    }
                )
        );
        setOpenAlertBox(true);
    };

    const data = useMemo(
        () =>
            members
                ? members?.data.map((item) => ({
                      id: item.id,
                      member: item,
                      email: item.email,
                      current_page: members.meta.current_page,
                  }))
                : [],
        [members]
    );

    const columns = useMemo(
        () => [
            {
                Header: 'Member Name',
                accessor: 'member',
                width: '30%',
            },
            {
                Header: 'Email',
                accessor: 'email',
                width: '65%',
            },
            {
                id: 'button-edit',
                accessor: 'button-edit',
                Cell: ({ row }) => (
                    <div className="table__actions is-centered">
                        <button
                            type="button"
                            className="table__actions__remove-btn"
                            onClick={() => {
                                setAlertBoxAction(
                                    () => () =>
                                        mutateMemberUpdate(row.original.id, {
                                            onSuccess: () =>
                                                setOpenAlertBox(false),
                                        })
                                );
                                setOpenAlertBox(true);
                            }}
                        >
                            Remove
                        </button>
                        <NavLink to={`/banned-members/${row.original.id}`}>
                            <BoxButton>
                                <Dots />
                            </BoxButton>
                        </NavLink>
                    </div>
                ),
            },
        ],
        [data]
    );

    const {
        getTableProps,
        headerGroups,
        prepareRow,
        page,
        rows,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        state: { pageIndex },
        gotoPage,
        pageCount,
    } = useTable(
        {
            columns,
            data,
            initialState: {
                pageIndex: data[0] ? data[0].current_page - 1 : 0,
                pageSize: members.meta.per_page,
            },
            manualPagination: true,
            pageCount: members.meta.last_page,
        },
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: 'selection',
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <TableCheckbox
                                {...getToggleAllRowsSelectedProps()}
                                onClick={(e) =>
                                    setIsAnyCheckBoxChecked(e.target.checked)
                                }
                            />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <TableCheckbox
                                {...row.getToggleRowSelectedProps()}
                                onClick={(e) =>
                                    setIsAnyCheckBoxChecked(e.target.checked)
                                }
                            />
                        </div>
                    ),
                },
                ...columns,
            ]);
        }
    );

    useEffect(() => {
        setIsAnyCheckBoxChecked(rows.find((item) => item.isSelected));
    }, [isAnyCheckBoxChecked, rows]);

    useEffect(() => {
        setCurrentTablePage(pageIndex + 1);
    }, [pageIndex]);

    return (
        <Fragment>
            {members.meta.total >= 10 && (
                <div className="table__actions">
                    <div className="table__actions-left">
                        <BulkActionsSelect
                            data={rows}
                            bulkAction={handleBulkActionOperation}
                            id="bulk_actions_select"
                            name="bulk_actions_select"
                            title="Bulk Actions"
                            actionLabel="Remove"
                            isAnyCheckBoxChecked={isAnyCheckBoxChecked}
                        />
                    </div>
                    <div className="table__actions-right">
                        <TablePagination
                            canPreviousPage={canPreviousPage}
                            pageIndex={pageIndex}
                            pageOptions={pageOptions}
                            canNextPage={canNextPage}
                            pageCount={pageCount}
                            nextPage={nextPage}
                            previousPage={previousPage}
                            gotoPage={gotoPage}
                        />
                    </div>
                </div>
            )}

            <div className="table-overflow">
                <div className="table-overflow__inner">
                    <Table {...getTableProps()}>
                        {page.length > 0 && (
                            <Table.Header>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps()}
                                            style={{ width: column.width }}
                                            className={column.id}
                                        >
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            <tr></tr>
                        </Table.Header>
                        )}
                        <Table.Body>
                            {page.length > 0 ? (
                                page.slice(0, 10).map((row) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map((cell) => (
                                                <td
                                                    {...cell.getCellProps()}
                                                    className={cell.column.id}
                                                >
                                                    {cell.column.id ===
                                                    'member' ? (
                                                        <TooltipUserAvatar
                                                            user={
                                                                row.original
                                                                    .member
                                                            }
                                                            projectSlug={
                                                                projectSlug
                                                            }
                                                        />
                                                    ) : cell.column.id ===
                                                      'email' ? (
                                                        <NavLink
                                                            to={`/banned-members/${row.original.id}`}
                                                        >
                                                            {cell.render(
                                                                'Cell'
                                                            )}
                                                        </NavLink>
                                                    ) : (
                                                        cell.render('Cell')
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4">
                                        Unfortunately, sometimes a community member needs a little time off. If you've banned any members (which you can do through their profile) they'll appear here.
                                    </td>
                                </tr>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            {members.meta.total >= 10 && (
                <div className="table__actions flex-end">
                    <TablePagination
                        canPreviousPage={canPreviousPage}
                        pageIndex={pageIndex}
                        pageOptions={pageOptions}
                        canNextPage={canNextPage}
                        pageCount={pageCount}
                        nextPage={nextPage}
                        previousPage={previousPage}
                        gotoPage={gotoPage}
                    />
                </div>
            )}
            <AlertBox
                isActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                deleteAction={alertBoxAction}
                message={`Are you sure you want to renew the access of the selected ${
                    selectedRowsItemsIDs.length > 0 ? 'members' : 'member'
                }?`}
            />
        </Fragment>
    );
};

export default TableBannedMembers;

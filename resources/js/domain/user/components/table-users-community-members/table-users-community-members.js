/**
 * External dependencies
 */
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { useTable, useRowSelect, usePagination } from 'react-table';
import { useLocation, NavLink } from 'react-router-dom';
import { parse } from 'qs';

/**
 * Internal dependencies
 */
import Table from '@app/components/table/table';
import BoxButton from '@app/components/box/box-button';
import Dots from '@app/components/dots/dots';
import TableCheckbox from '@app/components/table/table-checkbox';
import TableUsersCommunityMembersActions from '@app/domain/user/components/table-users-community-members/table-users-community-members-actions';
import TablePagination from '@app/components/table/table-pagination';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import AlertBox from '@app/components/alert-box/alert-box';
import useProjectCommunityMembersBulkDestroyMutation from '@app/data/project/use-project-community-members-bulk-destroy-mutation';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TableUsersCommunityMembers = ({
    communityMembers,
    ranks,
    currentTableFilterValue,
    setCurrentTableFilterValue,
    currentTablePage,
    setCurrentTablePage,
}) => {
    const [openAlertBoxForDeleteAction, setOpenAlertBoxForDeleteAction] =
        useState(false);
    const [selectedRowsItemsIDs, setSelectedRowsItemsIDs] = useState([]);
    const [isAnyCheckBoxChecked, setIsAnyCheckBoxChecked] = useState(false);
    const [wipeMemberContent, setWipeMemberContent] = useState(false);
    const [banMembers, setBanMembers] = useState(false);

    const location = useLocation();
    const queryArgs = parse(location.search, { ignoreQueryPrefix: true });

    const { mutate: mutateCommunityMembersDestroy } =
        useProjectCommunityMembersBulkDestroyMutation(
            projectSlug,
            currentTablePage,
            queryArgs
        );

    const handleBulkActionOperation = (values) => {
        setSelectedRowsItemsIDs(values);
        setOpenAlertBoxForDeleteAction(true);
    };

    const handleMutateCommunitiesDestroy = () => {
        mutateCommunityMembersDestroy(
            {
                members: selectedRowsItemsIDs,
                wipe_members_content: wipeMemberContent,
                ban_members: banMembers,
            },
            {
                onSuccess: () => setOpenAlertBoxForDeleteAction(false),
            }
        );
    };

    const data = useMemo(
        () =>
            communityMembers
                ? communityMembers?.data.map((item) => ({
                      id: item?.id,
                      member: item,
                      rank: item?.rank?.label,
                      email: item?.email,
                      submissions_count: item?.submissions_count,
                      adopted_submissions_count:
                          item?.adopted_submissions_count,
                      features_and_tasks_upvoted_count:
                          item?.features_and_tasks_upvoted_count,
                      comments_upvoted: item?.comments_upvoted,
                      current_page: communityMembers.meta.current_page,
                  }))
                : [],
        [communityMembers]
    );

    const columns = useMemo(
        () => [
            {
                Header: 'Member Name',
                accessor: 'member',
                width: '15%',
            },
            {
                Header: 'Rank',
                accessor: 'rank',
                width: '15%',
            },
            {
                Header: 'Email',
                accessor: 'email',
                width: '18%',
            },
            {
                Header: 'Submissions',
                accessor: 'submissions_count',
                width: '10%',
            },
            {
                Header: 'Adopted',
                accessor: 'adopted_submissions_count',
                width: '8%',
            },
            {
                Header: 'Features / Ideas Upvoted',
                accessor: 'features_and_tasks_upvoted_count',
                width: '20%',
            },
            {
                Header: 'Comments Upvoted',
                accessor: 'comments_upvoted',
            },
            {
                id: 'button-edit',
                accessor: 'button-edit',
                width: '1%',
                Cell: ({ row }) => (
                    <NavLink to={`/community-members/${row.original.id}`}>
                        <BoxButton>
                            <Dots />
                        </BoxButton>
                    </NavLink>
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
                pageSize: communityMembers.meta.per_page,
            },
            manualPagination: true,
            pageCount: communityMembers.meta.last_page,
        },
        usePagination,
        useRowSelect,
        (hooks) => {
            projectSlug &&
                hooks.visibleColumns.push((columns) => [
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <div>
                                <TableCheckbox
                                    {...getToggleAllRowsSelectedProps()}
                                    onClick={(e) =>
                                        setIsAnyCheckBoxChecked(
                                            e.target.checked
                                        )
                                    }
                                />
                            </div>
                        ),
                        Cell: ({ row }) => (
                            <div>
                                <TableCheckbox
                                    {...row.getToggleRowSelectedProps()}
                                    onClick={(e) =>
                                        setIsAnyCheckBoxChecked(
                                            e.target.checked
                                        )
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
        const isRowChecked = rows.find(
            (item) => item.isSelected && item.original.trash !== 'Trash'
        );

        setIsAnyCheckBoxChecked(isRowChecked);
    }, [isAnyCheckBoxChecked, data]);

    useEffect(() => {
        setCurrentTablePage(pageIndex + 1);
    }, [pageIndex]);

    return (
        <Fragment>
            {page.length > 0 && (
                <TableUsersCommunityMembersActions
                    rows={rows}
                    handleBulkActionOperation={handleBulkActionOperation}
                    data={data}
                    canPreviousPage={canPreviousPage}
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    canNextPage={canNextPage}
                    pageCount={pageCount}
                    nextPage={nextPage}
                    previousPage={previousPage}
                    gotoPage={gotoPage}
                    isAnyCheckBoxChecked={isAnyCheckBoxChecked}
                    ranks={ranks}
                    currentTableFilterValue={currentTableFilterValue}
                    setCurrentTableFilterValue={setCurrentTableFilterValue}
                />
            )}

            <div className="table-overflow">
                <div className="table-overflow__inner">
                    <Table {...getTableProps()}>
                        {page.length > 0 && (
                            <Table.Header>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => {
                                        if (
                                            !projectSlug &&
                                            column.id === 'rank'
                                        ) {
                                            return;
                                        }

                                        return (
                                            <th
                                                {...column.getHeaderProps()}
                                                style={{ width: column.width }}
                                                className={column.id}
                                            >
                                                {column.render('Header')}
                                            </th>
                                        );
                                    })}
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
                                            {row.cells.map((cell) => {
                                                if (
                                                    !projectSlug &&
                                                    cell.column.id === 'rank'
                                                ) {
                                                    return;
                                                }
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                        className={
                                                            cell.column.id
                                                        }
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
                                                                to={`/community-members/${row.original.id}`}
                                                                end
                                                            >
                                                                {cell.render(
                                                                    'Cell'
                                                                )}
                                                            </NavLink>
                                                        ) : (
                                                            cell.render('Cell')
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9">
                                        No followers just yet, but as your customers and community members join your project, this is where you'll find them.
                                    </td>
                                </tr>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            {page.length > 0 && (
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
                modifier="remove-member"
                isActive={openAlertBoxForDeleteAction}
                setOpenAlertBox={setOpenAlertBoxForDeleteAction}
                deleteAction={handleMutateCommunitiesDestroy}
                message="Are you sure you want to remove this member from this project? Additionally, you may wipe all
                of their content, <br/> and/or ban them from the project altogether. Select all that apply below, or
                simply click “Confirm” to remove them from the project without removing their contributions."
                additionalActions={[
                    {
                        title: 'Wipe member content',
                        description:
                            'Select to fully remove all comments, upvotes, stats, and other details associated with this member. This cannot be undone! Note: the user can rejoin the project in the future unless you also select the “Ban Member” option below.',
                        handler: (e) => setWipeMemberContent(e.target.checked),
                    },
                    {
                        title: 'Ban member',
                        description:
                            'This option will ban this member from the project, and will prevent<br/> the user from rejoining the project unless you remove the ban.',
                        handler: (e) => setBanMembers(e.target.checked),
                    },
                ]}
            />
        </Fragment>
    );
};

export default TableUsersCommunityMembers;

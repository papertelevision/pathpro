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
import TableTeamMembersActions from '@app/domain/user/components/table-team-members/table-team-members-actions';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import AlertBox from '@app/components/alert-box/alert-box';
import TablePagination from '@app/components/table/table-pagination';
import useProjectTeamMembersBulkDestroyMutation from '@app/data/project/use-project-team-members-bulk-destroy-mutation';
import useTeamMemberInvitationUpdateMutation from '@app/data/team-member-invitation/use-team-member-invitation-update-mutation';
import useTeamMembersInvitationsBulkUpdateMutation from '@app/data/team-member-invitation/use-team-members-invitations-bulk-update-mutation';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TableTeamMembers = ({
    teamMembers,
    invitations,
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

    const { mutate: mutateTeamMemberInvitationUpdate } =
        useTeamMemberInvitationUpdateMutation();
    const { mutate: mutateTeamMembersInvitationsBulkUpdate } =
        useTeamMembersInvitationsBulkUpdateMutation();
    const { mutate: mutateTeamMembersDestroy } =
        useProjectTeamMembersBulkDestroyMutation(
            projectSlug,
            currentTablePage,
            queryArgs
        );

    const handleBulkActionOperation = (values) => {
        setSelectedRowsItemsIDs(values);
        setOpenAlertBoxForDeleteAction(true);
    };

    const handleMutateTeamMembersDestroy = () => {
        mutateTeamMembersDestroy(
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
            teamMembers
                ? teamMembers?.data.map((item) => ({
                      id: item?.id,
                      member: item,
                      email: item?.email,
                      current_page: teamMembers.meta.current_page,
                      invitation: invitations.find(
                          (inv) => inv.user_id === item.id
                      ),
                  }))
                : [],
        [teamMembers]
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
                Cell: ({ row }) =>
                    row.original.invitation ? (
                        <div className="table__actions is-centered">
                            <i className="table__actions__text">
                                {projectSlug
                                    ? `Invitation sent ${row.original.invitation.created_at}`
                                    : 'Invitations sent'}
                            </i>
                            <button
                                type="button"
                                className="table__actions__inv-btn"
                                onClick={() =>
                                    projectSlug
                                        ? mutateTeamMemberInvitationUpdate(
                                              row.original.invitation.id
                                          )
                                        : mutateTeamMembersInvitationsBulkUpdate(
                                              row.original.id
                                          )
                                }
                            >
                                {projectSlug
                                    ? 'Resend Invitation'
                                    : 'Resend Invitations'}
                            </button>
                        </div>
                    ) : (
                        <NavLink to={`/team-members/${row.original.id}`}>
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
                pageSize: teamMembers.meta.per_page,
            },
            manualPagination: true,
            pageCount: teamMembers.meta.last_page,
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
                <TableTeamMembersActions
                    rows={rows}
                    handleBulkActionOperation={handleBulkActionOperation}
                    canPreviousPage={canPreviousPage}
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    canNextPage={canNextPage}
                    pageCount={pageCount}
                    nextPage={nextPage}
                    previousPage={previousPage}
                    gotoPage={gotoPage}
                    isAnyCheckBoxChecked={isAnyCheckBoxChecked}
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
                                                                to={`/team-members/${row.original.id}`}
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
                                    <td colSpan="4">
                                        You haven't invited any team members to this project. To do so, click the "Invite Team Member" button in the top right of this page and get the collaboration rolling!
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
                deleteAction={handleMutateTeamMembersDestroy}
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

export default TableTeamMembers;

/**
 * External dependencies
 */
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { useTable, useRowSelect, usePagination } from 'react-table';
import { NavLink } from 'react-router-dom';
import { startCase, upperCase } from 'lodash';

/**
 * Internal dependencies
 */
import Table from '@app/components/table/table';
import TableCheckbox from '@app/components/table/table-checkbox';
import TableSubmissionsIndexActions from '@app/domain/submission/components/table-submissions/table-submissions-index-actions';
import TablePagination from '@app/components/table/table-pagination';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import BoxButton from '@app/components/box/box-button';
import Dots from '@app/components/dots/dots';
import Icon from '@app/components/icon/icon';
import AlertBox from '@app/components/alert-box/alert-box';
import useSubmissionsBulkDestroyMutation from '@app/data/submission/use-submissions-bulk-destroy-mutation';
import useSubmissionUpdateMutation from '@app/data/submission/use-submission-update-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useSubdomain } from '@app/lib/domain';
import { dateFormat } from '@app/lib/date-format';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TableSubmissionsIndex = ({
    submissions,
    statuses,
    currentTableFilterValue,
    currentTablePage,
    setCurrentTableFilterValue,
    setSelectedProjectSlug,
    setCurrentTablePage,
    queryArgs,
}) => {
    const [openAlertBoxForDeleteAction, setOpenAlertBoxForDeleteAction] =
        useState(false);
    const [selectedRowsItemsIDs, setSelectedRowsItemsIDs] = useState([]);
    const [isAnyCheckBoxChecked, setIsAnyCheckBoxChecked] = useState(false);

    const { canUpdateProject, canCreateEditTasksFeatures } =
        usePermissionsContextApi();

    const {
        mutate: mutateSubmissionsUpdate,
        isLoading: isMutateSubmissionsUpdate,
    } = useSubmissionUpdateMutation(
        null,
        projectSlug,
        currentTablePage,
        queryArgs
    );

    const { mutate: mutateSubmissionsDestroy } =
        useSubmissionsBulkDestroyMutation(
            projectSlug,
            currentTablePage,
            queryArgs
        );

    const handleBulkActionOperation = (values) => {
        setSelectedRowsItemsIDs(values);
        setOpenAlertBoxForDeleteAction(true);
    };

    const handleMutateSubmissionsDestroy = () => {
        mutateSubmissionsDestroy(
            { submissions: selectedRowsItemsIDs },
            {
                onSuccess: () => {
                    setOpenAlertBoxForDeleteAction(false);
                },
            }
        );
    };

    const handleHighlightSubmission = (values) => {
        mutateSubmissionsUpdate({
            ...values,
            is_highlighted: !values.is_highlighted,
            status: null,
        });
    };

    const data = useMemo(
        () =>
            submissions
                ? submissions.data
                      .map((item) => ({
                          id: item?.id,
                          submitter: item.author,
                          date: dateFormat(
                              item?.created_at,
                              item?.project.date_format,
                              true
                          ),
                          submission: item?.title,
                          project_title: item?.project?.title,
                          project_slug: item?.project?.slug,
                          project_id: item?.project?.id,
                          title: item?.title,
                          description: item?.description,
                          status:
                              item?.status === null
                                  ? 'No Status Applied'
                                  : item?.status,
                          is_highlighted: item.is_highlighted,
                          allow_highlighting: item.allow_highlighting,
                          trash: item?.deleted_at !== null ? 'Trash' : 'Active',
                          current_page: submissions.meta.current_page,
                      }))
                      .filter((item) => item)
                : [],
        [submissions, isMutateSubmissionsUpdate]
    );

    const columns = useMemo(
        () => [
            {
                Header: 'Submitted by',
                accessor: 'submitter',
                width: '30%',
                Cell: ({ row }) => (
                    <Fragment>
                        <TooltipUserAvatar
                            user={row.original.submitter}
                            projectSlug={row.original.project_slug}
                        />
                        <span className="date">{row.original.date}</span>
                    </Fragment>
                ),
            },
            {
                Header: 'Feature/Idea Title',
                accessor: 'submission',
                width: '30%',
                Cell: ({ row }) => (
                    <>
                        {row.original.trash !== 'Trash' && (
                            <NavLink
                                to={useSubdomain(
                                    row.original.project_slug,
                                    `submissions/${row.original.id}`
                                )}
                            >
                                {row.original.submission}
                            </NavLink>
                        )}
                    </>
                ),
            },
            {
                Header: 'For Project/Goal',
                accessor: 'project',
                width: '20%',
                Cell: ({ row }) => (
                    <Fragment>
                        {row.original.trash !== 'Trash' && (
                            <NavLink
                                to={useSubdomain(row.original.project_slug)}
                            >
                                {row.original.project_title}
                            </NavLink>
                        )}
                    </Fragment>
                ),
            },
            {
                Header: 'Status ',
                accessor: 'status',
                width: '19%',
                Cell: ({ row }) => (
                    <Fragment>
                        {adoptedMarkup(row.original.status)}
                        <span className={classColorName(row.original.status)}>
                            {row.original.status === 'new'
                                ? upperCase(row.original.status)
                                : startCase(row.original.status)}
                        </span>
                    </Fragment>
                ),
            },
            {
                Header: 'Trash',
                accessor: 'trash',
            },
            {
                id: 'button-edit',
                accessor: 'button-edit',
                Cell: ({ row }) => (
                    <div className="icon-button-wrapper">
                        {row.original.allow_highlighting &&
                            canCreateEditTasksFeatures(
                                row.original.project_id
                            ) && (
                                <div className="icon-button-wrapper__item margin-left">
                                    <BoxButton
                                        onClick={() =>
                                            handleHighlightSubmission(
                                                row.original
                                            )
                                        }
                                    >
                                        {row.original.is_highlighted ? (
                                            <div className="icon-edit is-editable-bigger">
                                                <Icon type="highlight" />
                                            </div>
                                        ) : (
                                            <Icon type="highlight" />
                                        )}
                                    </BoxButton>
                                </div>
                            )}
                        {row.original.trash !== 'Trash' && (
                            <NavLink
                                to={useSubdomain(
                                    row.original.project_slug,
                                    `submissions/${row.original.id}`
                                )}
                            >
                                <BoxButton>
                                    <Dots />
                                </BoxButton>
                            </NavLink>
                        )}
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
                pageSize: submissions.meta.per_page,
                hiddenColumns: 'trash',
            },
            manualPagination: true,
            pageCount: submissions.meta.last_page,
        },
        usePagination,
        useRowSelect,
        (hooks) =>
            hooks.visibleColumns.push((columns) => [
                {
                    id: 'selection',
                    Header: ({
                        toggleRowSelected,
                        isAllPageRowsSelected,
                        page,
                    }) => {
                        const modifiedOnChange = (event) => {
                            page.forEach((row) => {
                                !row.original.disabled &&
                                    toggleRowSelected(
                                        row.id,
                                        event.currentTarget.checked
                                    );
                            });
                            setIsAnyCheckBoxChecked(event.target.checked);
                        };

                        let selectableRowsInCurrentPage = 0;
                        let selectedRowsInCurrentPage = 0;
                        page.forEach((row) => {
                            row.isSelected && selectedRowsInCurrentPage++;
                            !row.original.disabled &&
                                selectableRowsInCurrentPage++;
                        });

                        const disabled = selectableRowsInCurrentPage === 0;
                        const checked =
                            (isAllPageRowsSelected ||
                                selectableRowsInCurrentPage ===
                                    selectedRowsInCurrentPage) &&
                            !disabled;

                        return (
                            <div>
                                <TableCheckbox
                                    checked={checked}
                                    disabled={disabled}
                                    onChange={modifiedOnChange}
                                />
                            </div>
                        );
                    },
                    Cell: ({ row }) => {
                        const isDisabled = !canUpdateProject(
                            row.original.project_id
                        );
                        row.original['disabled'] = isDisabled;
                        return (
                            row.original.trash !== 'Trash' && (
                                <div>
                                    <TableCheckbox
                                        {...row.getToggleRowSelectedProps()}
                                        disabled={isDisabled}
                                        onClick={(e) =>
                                            setIsAnyCheckBoxChecked(
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                            )
                        );
                    },
                },
                ...columns,
            ])
    );

    const classColorName = (status) => {
        const statusLower = status.toLowerCase();

        switch (statusLower) {
            case 'new':
                return 'is-green';
            case 'denied':
                return 'is-red';
            case 'roadmap':
                return 'is-blue-45';
            case 'voting':
                return 'is-blue-45';
            default:
                return '';
        }
    };

    const adoptedMarkup = (status) =>
        (status === 'roadmap' || status === 'voting') && <span>Adopted: </span>;

    useEffect(() => {
        const isRowChecked = rows.find(
            (item) =>
                item.isSelected &&
                item.original.trash !== 'Trash' &&
                !item.original.disabled
        );

        setIsAnyCheckBoxChecked(isRowChecked);
    }, [isAnyCheckBoxChecked, data]);

    useEffect(() => {
        setCurrentTablePage(pageIndex + 1);
    }, [pageIndex]);

    return (
        <Fragment>
            {page.length > 0 && (
                <TableSubmissionsIndexActions
                    rows={rows}
                    handleBulkActionOperation={handleBulkActionOperation}
                    data={data}
                    statuses={statuses}
                    canPreviousPage={canPreviousPage}
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    canNextPage={canNextPage}
                    pageCount={pageCount}
                    nextPage={nextPage}
                    previousPage={previousPage}
                    gotoPage={gotoPage}
                    isAnyCheckBoxChecked={isAnyCheckBoxChecked}
                    currentTableFilterValue={currentTableFilterValue}
                    setCurrentTableFilterValue={setCurrentTableFilterValue}
                    setSelectedProjectSlug={setSelectedProjectSlug}
                />
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
                                                    {cell.render('Cell')}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6">
                                        No submissions from your community just yet, but don't worry, they'll start sharing their ideas soon!
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
                isActive={openAlertBoxForDeleteAction}
                setOpenAlertBox={setOpenAlertBoxForDeleteAction}
                deleteAction={handleMutateSubmissionsDestroy}
                message="Are you sure you wish to delete the selected entry/entries? This cannot be undone."
            />
        </Fragment>
    );
};

export default TableSubmissionsIndex;

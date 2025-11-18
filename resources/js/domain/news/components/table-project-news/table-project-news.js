/**
 * External dependencies
 */
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { useTable, useRowSelect, usePagination } from 'react-table';
import { NavLink, useLocation } from 'react-router-dom';
import qs from 'qs';

/**
 * Internal dependencies
 */
import Table from '@app/components/table/table';
import BoxButton from '@app/components/box/box-button';
import Dots from '@app/components/dots/dots';
import TableCheckbox from '@app/components/table/table-checkbox';
import TablePagination from '@app/components/table/table-pagination';
import TableProjectNewsActions from '@app/domain/news/components/table-project-news/table-project-news-actions';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import Modal from '@app/components/modal/modal';
import ModalEditNewsUpdate from '@app/domain/news/components/modal-edit-news-update/modal-edit-news-update';
import AlertBox from '@app/components/alert-box/alert-box';
import useNewsBulkDestroyMutation from '@app/data/news/use-news-bulk-destroy-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { dateFormat } from '@app/lib/date-format';

const TableProjectNews = ({
    news,
    project,
    newsAuthors,
    currentTablePage,
    setCurrentTablePage,
    currentTableFilterValue,
    setCurrentTableFilterValue,
}) => {
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [openAlertBoxForDeleteAction, setOpenAlertBoxForDeleteAction] =
        useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [isEditNewsUpdateModalOpen, setIsEditNewsUpdateModalOpen] =
        useState(false);
    const [newsUpdateForEdit, setNewsUpdateForEdit] = useState([]);
    const [selectedRowsItemsIDs, setSelectedRowsItemsIDs] = useState([]);
    const [isAnyCheckBoxChecked, setIsAnyCheckBoxChecked] = useState(false);

    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { canEditProductNews, canUpdateProject } = usePermissionsContextApi();

    const { mutate: mutateNewsDestroy } = useNewsBulkDestroyMutation(
        project.slug,
        currentTablePage,
        queryArgs
    );

    const closeEditNewsUpdateModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsEditNewsUpdateModalOpen(false);
        }
    };

    const handleFindNewsUpdateForEdit = (newsUpdateID) => {
        const newsUpdate = news.data.find((item) => item.id === newsUpdateID);

        setNewsUpdateForEdit(newsUpdate);
        setIsEditNewsUpdateModalOpen(true);
    };

    const handleBulkActionOperation = (values) => {
        setSelectedRowsItemsIDs(values);
        setOpenAlertBoxForDeleteAction(true);
    };

    const handleMutateNewsDestroy = () => {
        mutateNewsDestroy(
            { news: selectedRowsItemsIDs },
            {
                onSuccess: () => {
                    setOpenAlertBoxForDeleteAction(false);
                },
            }
        );
    };

    const data = useMemo(
        () =>
            news
                ? news?.data.map((item) => ({
                      id: item?.id,
                      author: item.author,
                      title: item?.title,
                      project_id: item?.project_id,
                      date: dateFormat(
                          item?.created_at,
                          project.date_format,
                          true
                      ),
                      status:
                          item?.status.substr(0, 1).toUpperCase() +
                          item?.status.substr(1),
                      trash: item?.deleted_at !== null ? 'Trash' : 'Active',
                      current_page: news.meta.current_page,
                  }))
                : [],
        [news]
    );

    const columns = useMemo(
        () => [
            {
                Header: 'Author',
                accessor: 'author',
                width: '20%',
            },
            {
                Header: 'Title',
                accessor: 'title',
                width: '20%',
                Cell: ({ row }) => (
                    <>
                        {row.original.trash !== 'Trash' && (
                            <NavLink to={`/news/${row.original.id}`}>
                                {row.original.title}
                            </NavLink>
                        )}
                    </>
                ),
            },
            {
                Header: 'Date',
                accessor: 'date',
                width: '30%',
            },
            {
                Header: 'Status',
                accessor: 'status',
                width: '20%',
            },
            {
                Header: 'Trash',
                accessor: 'trash',
            },
            {
                id: 'button-edit',
                accessor: 'button-edit',
                Cell: ({ row }) => {
                    if (
                        canEditProductNews(project.id) &&
                        row.original.trash !== 'Trash' &&
                        row.original.status !== 'Archived'
                    ) {
                        return (
                            <BoxButton
                                onClick={() =>
                                    handleFindNewsUpdateForEdit(row.original.id)
                                }
                            >
                                <Dots />
                            </BoxButton>
                        );
                    } else {
                        return null;
                    }
                },
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
                pageSize: news.meta.per_page,
                hiddenColumns: 'trash',
            },
            manualPagination: true,
            pageCount: news.meta.last_page,
        },
        usePagination,
        useRowSelect,
        (hooks) => {
            canUpdateProject(project.id) &&
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
                        Cell: ({ row }) =>
                            row.original.trash !== 'Trash' ? (
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
                            ) : (
                                <div> </div>
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
                <TableProjectNewsActions
                    rows={rows}
                    handleBulkActionOperation={handleBulkActionOperation}
                    data={news}
                    canPreviousPage={canPreviousPage}
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    canNextPage={canNextPage}
                    pageCount={pageCount}
                    nextPage={nextPage}
                    previousPage={previousPage}
                    gotoPage={gotoPage}
                    isAnyCheckBoxChecked={isAnyCheckBoxChecked}
                    dynamicData={newsAuthors}
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
                                                        'author' ? (
                                                            <TooltipUserAvatar
                                                                user={
                                                                    row.original
                                                                        .author
                                                                }
                                                                projectSlug={
                                                                    project.slug
                                                                }
                                                            />
                                                        ) : cell.value ===
                                                          'Live' ? (
                                                            <strong>
                                                                {cell.render(
                                                                    'Cell'
                                                                )}
                                                            </strong>
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
                                    <td colSpan="6">
                                        You haven't added any project news yet. Click the "Add News Update" button in the top right to add your first news update!
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

            <Modal
                larger
                className="full-height"
                modalIsOpen={isEditNewsUpdateModalOpen}
                setIsModalOpen={setIsEditNewsUpdateModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeEditNewsUpdateModal}
            >
                <ModalEditNewsUpdate
                    closeModal={closeEditNewsUpdateModal}
                    setIsFormChanged={setIsFormChanged}
                    setIsEditNewsUpdateModalOpen={setIsEditNewsUpdateModalOpen}
                    newsUpdate={newsUpdateForEdit}
                    project={project}
                    currentTablePage={currentTablePage}
                />
            </Modal>

            <AlertBox
                isActive={openAlertBoxForDeleteAction}
                setOpenAlertBox={setOpenAlertBoxForDeleteAction}
                deleteAction={handleMutateNewsDestroy}
                message="Are you sure you wish to delete the selected entry/entries? This cannot be undone."
            />
        </Fragment>
    );
};

export default TableProjectNews;

/**
 * External dependencies
 */
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { useTable, useRowSelect, usePagination } from 'react-table';
import { useLocation, NavLink } from 'react-router-dom';
import qs from 'qs';

/**
 * Internal dependencies
 */
import Table from '@app/components/table/table';
import BoxButton from '@app/components/box/box-button';
import Dots from '@app/components/dots/dots';
import TableCheckbox from '@app/components/table/table-checkbox';
import TableProjectReleaseNotesActions from '@app/domain/release-note/components/table-project-release-notes/table-project-release-notes-actions';
import TablePagination from '@app/components/table/table-pagination';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import Modal from '@app/components/modal/modal';
import ModalEditReleaseNote from '@app/domain/release-note/components/modal-edit-release-note/modal-edit-release-note';
import AlertBox from '@app/components/alert-box/alert-box';
import useReleaseNotesBulkDestroyMutation from '@app/data/release-note/use-release-notes-bulk-destroy-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { dateFormat } from '@app/lib/date-format';

const TableProjectReleaseNotes = ({
    releaseNotes,
    releaseNotesAuthors,
    project,
    currentTablePage,
    setCurrentTablePage,
    currentTableFilterValue,
    setCurrentTableFilterValue,
}) => {
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [openAlertBoxForDeleteAction, setOpenAlertBoxForDeleteAction] =
        useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [isEditReleaseNoteModalOpen, setIsEditReleaseNoteModalOpen] =
        useState(false);
    const [releaseNoteForEdit, setReleaseNoteForEdit] = useState([]);
    const [selectedRowsItemsIDs, setSelectedRowsItemsIDs] = useState([]);
    const [isAnyCheckBoxChecked, setIsAnyCheckBoxChecked] = useState(false);

    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { isUserLoggedIn, canUpdateReleaseNotes, canUpdateProject } =
        usePermissionsContextApi();

    const { mutate: mutateReleaseNotesDestroy } =
        useReleaseNotesBulkDestroyMutation(
            project.slug,
            currentTablePage,
            queryArgs
        );

    const closeEditReleaseNoteModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsEditReleaseNoteModalOpen(false);
        }
    };

    const handleFindReleaseNoteForEdit = (releaseNoteID) => {
        const releaseNote = releaseNotes.data.find(
            (item) => item.id === releaseNoteID
        );

        setReleaseNoteForEdit(releaseNote);
        setIsEditReleaseNoteModalOpen(true);
    };

    const handleBulkActionOperation = (values) => {
        setSelectedRowsItemsIDs(values);
        setOpenAlertBoxForDeleteAction(true);
    };

    const handleMutateReleaseNotesDestroy = () => {
        mutateReleaseNotesDestroy(
            { release_notes: selectedRowsItemsIDs },
            {
                onSuccess: () => {
                    setOpenAlertBoxForDeleteAction(false);
                },
            }
        );
    };

    const data = useMemo(
        () =>
            releaseNotes
                ? releaseNotes?.data.map((item) => ({
                      id: item?.id,
                      author: item.author,
                      author_id: item?.author?.id,
                      title: item?.title,
                      project_id: item?.project_id,
                      date: dateFormat(
                          item?.created_at,
                          project.date_format,
                          true
                      ),
                      status: item?.status,
                      trash: item?.deleted_at !== null ? 'Trash' : 'Active',
                      current_page: releaseNotes.meta.current_page,
                  }))
                : [],
        [releaseNotes]
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
                Cell: ({ row }) =>
                    row.original.trash !== 'Trash' &&
                    isUserLoggedIn &&
                    canUpdateReleaseNotes(project.id) && (
                        <BoxButton
                            onClick={() =>
                                handleFindReleaseNoteForEdit(row.original.id)
                            }
                        >
                            <Dots />
                        </BoxButton>
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
                pageSize: releaseNotes.meta.per_page,
                hiddenColumns: 'trash',
            },
            manualPagination: true,
            pageCount: releaseNotes.meta.last_page,
        },
        usePagination,
        useRowSelect,
        (hooks) => {
            isUserLoggedIn && canUpdateProject(project.id)
                ? hooks.visibleColumns.push((columns) => [
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
                  ])
                : null;
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
                <TableProjectReleaseNotesActions
                    rows={rows}
                    handleBulkActionOperation={handleBulkActionOperation}
                    data={releaseNotes}
                    canPreviousPage={canPreviousPage}
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    canNextPage={canNextPage}
                    pageCount={pageCount}
                    nextPage={nextPage}
                    previousPage={previousPage}
                    gotoPage={gotoPage}
                    isAnyCheckBoxChecked={isAnyCheckBoxChecked}
                    dynamicData={releaseNotesAuthors}
                    currentTableFilterValue={currentTableFilterValue}
                    setCurrentTableFilterValue={setCurrentTableFilterValue}
                    totalEntries={releaseNotes.meta.total}
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
                                                        ) : cell.column.id ===
                                                          'title' ? (
                                                            row.original
                                                                .trash !==
                                                            'Trash' ? (
                                                                <NavLink
                                                                    to={`/release-notes/${row.original.id}`}
                                                                    end
                                                                >
                                                                    {cell.render(
                                                                        'Cell'
                                                                    )}
                                                                </NavLink>
                                                            ) : (
                                                                cell.render(
                                                                    'Cell'
                                                                )
                                                            )
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
                                        You haven't added any release notes yet. Click the "Add Release" button in the top right to add your first release notes!
                                    </td>
                                </tr>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            {releaseNotes.meta.total >= 10 && (
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
                className="full-height"
                modalIsOpen={isEditReleaseNoteModalOpen}
                setIsModalOpen={setIsEditReleaseNoteModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeEditReleaseNoteModal}
            >
                <Modal.Content>
                    <ModalEditReleaseNote
                        closeModal={closeEditReleaseNoteModal}
                        setIsFormChanged={setIsFormChanged}
                        setIsEditReleaseNoteModalOpen={
                            setIsEditReleaseNoteModalOpen
                        }
                        releaseNote={releaseNoteForEdit}
                        projectData={project}
                        currentTablePage={currentTablePage}
                    />
                </Modal.Content>
            </Modal>

            <AlertBox
                isActive={openAlertBoxForDeleteAction}
                setOpenAlertBox={setOpenAlertBoxForDeleteAction}
                deleteAction={handleMutateReleaseNotesDestroy}
                message="Are you sure you wish to delete the selected entry/entries? This cannot be undone."
            />
        </Fragment>
    );
};

export default TableProjectReleaseNotes;

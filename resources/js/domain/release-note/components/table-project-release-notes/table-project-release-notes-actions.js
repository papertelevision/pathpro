/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import FilterSelect from '@app/components/filter-select/filter-select';
import BulkActionsSelect from '@app/components/bulk-actions-select/bulk-actions-select';
import TablePagination from '@app/components/table/table-pagination';
import FilterButton from '@app/components/filter-button/filter-button';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TableProjectReleaseNotesActions = ({
    rows,
    handleBulkActionOperation,
    data,
    canPreviousPage,
    pageIndex,
    pageOptions,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    gotoPage,
    isAnyCheckBoxChecked,
    dynamicData,
    currentTableFilterValue,
    setCurrentTableFilterValue,
}) => {
    const { isUserLoggedIn, canUpdateProject } = usePermissionsContextApi();

    return (
        <div className="table__actions">
            <div className="table__actions-left">
                {isUserLoggedIn && canUpdateProject(null, projectSlug) && (
                    <BulkActionsSelect
                        data={rows}
                        bulkAction={handleBulkActionOperation}
                        id="bulk_actions_select"
                        name="bulk_actions_select"
                        title="Bulk Actions"
                        isAnyCheckBoxChecked={isAnyCheckBoxChecked}
                    />
                )}

                <FilterSelect
                    filterValue="username"
                    id="author_filter"
                    name="releaseNotesAuthorFilter"
                    title="Filter by Author"
                    dynamicData={dynamicData}
                    currentTableFilterValue={currentTableFilterValue}
                    setCurrentTableFilterValue={setCurrentTableFilterValue}
                />
                <ul>
                    <li>
                        <FilterButton
                            data={data}
                            filterValue="releaseNotes"
                            buttonValue="All"
                        />
                    </li>
                    <li>
                        <FilterButton
                            data={data}
                            filterValue="releaseNotes"
                            buttonValue="Published"
                        />
                    </li>
                    <li>
                        <FilterButton
                            data={data}
                            filterValue="releaseNotes"
                            buttonValue="Draft"
                        />
                    </li>
                    <li>
                        <FilterButton
                            data={data}
                            filterValue="releaseNotes"
                            buttonValue="Trash"
                        />
                    </li>
                </ul>
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
    );
};

export default TableProjectReleaseNotesActions;

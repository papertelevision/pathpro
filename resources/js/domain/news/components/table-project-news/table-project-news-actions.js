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

const TableProjectNewsActions = ({
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
    totalEntries,
}) => {
    const { canUpdateProject } = usePermissionsContextApi();

    const statusFilters = [
        { value: 'all', label: `All (${data.meta.allTotals})` },
        { value: 'live', label: `Live (${data.meta.liveTotals})` },
        { value: 'draft', label: `Draft (${data.meta.draftTotals})` },
        { value: 'archived', label: `Archived (${data.meta.archivedTotals})` },
        { value: 'deleted', label: `Trash (${data.meta.deletedTotals})` },
    ];

    return (
        <div className="table__actions">
            <div className="table__actions-left">
                {canUpdateProject(null, projectSlug) && (
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
                    name="newsAuthorFilter"
                    title="Filter by Author"
                    dynamicData={dynamicData}
                    currentTableFilterValue={currentTableFilterValue}
                    setCurrentTableFilterValue={setCurrentTableFilterValue}
                />

                <ul>
                    {statusFilters.map((statusFilter) => (
                        <li key={statusFilter.value}>
                            <FilterButton
                                data={data}
                                filterValue="news"
                                value={statusFilter.value}
                                label={statusFilter.label}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            {totalEntries >= 10 && (
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
            )}
        </div>
    );
};

export default TableProjectNewsActions;

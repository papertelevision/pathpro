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

const TableSubmissionsIndexActions = ({
    rows,
    handleBulkActionOperation,
    data,
    statuses,
    canPreviousPage,
    pageIndex,
    pageOptions,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    gotoPage,
    isAnyCheckBoxChecked,
    currentTableFilterValue,
    setCurrentTableFilterValue,
    totalEntries,
}) => (
    <div className="table__actions">
        <div className="table__actions-left">
            <BulkActionsSelect
                data={rows}
                bulkAction={handleBulkActionOperation}
                id="bulk_actions_select"
                name="bulk_actions_select"
                title="Bulk Actions"
                isAnyCheckBoxChecked={isAnyCheckBoxChecked}
            />
            <FilterSelect
                filterValue="status"
                id="status_filter"
                name="submissionsStatusFilter"
                title="Filter by Status"
                dynamicData={data}
                statuses={statuses}
                currentTableFilterValue={currentTableFilterValue}
                setCurrentTableFilterValue={setCurrentTableFilterValue}
            />
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

export default TableSubmissionsIndexActions;

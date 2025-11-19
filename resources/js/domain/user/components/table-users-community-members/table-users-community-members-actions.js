/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import BulkActionsSelect from '@app/components/bulk-actions-select/bulk-actions-select';
import TablePagination from '@app/components/table/table-pagination';
import FilterSelect from '@app/components/filter-select/filter-select';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TableUsersCommunityMembersActions = ({
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
    ranks,
    currentTableFilterValue,
    setCurrentTableFilterValue,
    totalEntries,
}) => {
    const { canUpdateProject } = usePermissionsContextApi();

    return (
        <div className="table__actions">
            <div className="table__actions-left">
                {projectSlug && canUpdateProject(null, projectSlug) && (
                    <BulkActionsSelect
                        data={rows}
                        bulkAction={handleBulkActionOperation}
                        id="bulk_actions_select"
                        name="bulk_actions_select"
                        title="Bulk Actions"
                        isAnyCheckBoxChecked={isAnyCheckBoxChecked}
                    />
                )}
                {projectSlug && (
                    <FilterSelect
                        filterValue="rank"
                        id="rank_filter"
                        name="communityMembersRankFilter"
                        title="Filter by Rank"
                        dynamicData={data}
                        ranks={ranks}
                        currentTableFilterValue={currentTableFilterValue}
                        setCurrentTableFilterValue={setCurrentTableFilterValue}
                    />
                )}
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

export default TableUsersCommunityMembersActions;

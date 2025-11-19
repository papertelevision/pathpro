/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import BulkActionsSelect from '@app/components/bulk-actions-select/bulk-actions-select';
import TablePagination from '@app/components/table/table-pagination';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TableTeamMembersActions = ({
    rows,
    handleBulkActionOperation,
    canPreviousPage,
    pageIndex,
    pageOptions,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    gotoPage,
    isAnyCheckBoxChecked,
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

export default TableTeamMembersActions;

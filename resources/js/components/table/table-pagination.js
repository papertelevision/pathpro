/**
 * External dependencies
 */
import React, { useRef } from 'react';

const TablePagination = ({
    canPreviousPage,
    pageIndex,
    pageOptions,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    gotoPage,
}) => {
    const inputNumber = useRef();
    const handleChangePage = (e) => {
        const intValue = parseInt(e.target.value);
        const pageNumber = e.target.value ? intValue - 1 : 0;

        if (intValue < 1) {
            gotoPage(0);
            inputNumber.current.value = 1;
        } else {
            inputNumber.current.value =
                intValue > pageCount ? pageCount : intValue;
            gotoPage(intValue > pageCount ? pageCount : pageNumber);
        }
    };

    return (
        <div className="table__pagination">
            <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="table__pagination-button"
            >
                &#171;
            </button>
            <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="table__pagination-button"
            >
                &#8249;
            </button>
            <input
                value={pageIndex + 1}
                type="number"
                ref={inputNumber}
                onChange={handleChangePage}
            />
            <span>of {pageOptions.length}</span>
            <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="table__pagination-button"
            >
                &#8250;
            </button>
            <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className="table__pagination-button"
            >
                &#187;
            </button>
        </div>
    );
};

export default TablePagination;

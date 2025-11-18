/**
 * External dependencies
 */
import React, { forwardRef, useRef, useEffect } from 'react';

const TableCheckbox = forwardRef(
    ({ indeterminate, onClick, disabled, ...rest }, ref) => {
        const defaultRef = useRef();
        const resolvedRef = ref || defaultRef;

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return (
            <>
                <input
                    type="checkbox"
                    ref={resolvedRef}
                    {...rest}
                    className="table__checkbox"
                    onClick={onClick}
                    disabled={disabled}
                />
            </>
        );
    }
);

export default TableCheckbox;

/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import TableHeader from '@app/components/table/table-header';
import TableBody from '@app/components/table/table-body';

const Table = ({ children, className }) => (
    <table className="table" className={classNames('table', className)}>
        {children}
    </table>
);

Table.Header = TableHeader;
Table.Body = TableBody;

export default Table;

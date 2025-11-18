/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const AccordionHeaderLeft = ({ children, className, ...props }) => (
    <div {...props} className={classNames('accordion__header-left', className)}>
        {children}
    </div>
);

export default AccordionHeaderLeft;

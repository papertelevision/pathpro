/**
 * External dependencies
 */
import React, { forwardRef } from 'react';
import classNames from 'classnames';

const Group = forwardRef(({ modifier, children }, ref) => (
    <div
        ref={ref}
        className={classNames('group', {
            [`group--${modifier}`]: modifier,
        })}
    >
        {children}
    </div>
));

export default Group;

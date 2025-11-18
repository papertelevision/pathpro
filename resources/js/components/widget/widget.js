/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const Widget = ({ modifier, className, children }) => {
    return (
        <div
            className={classNames('widget', className, {
                [`widget--${modifier}`]: modifier,
            })}
        >
            {children}
        </div>
    );
};

export default Widget;

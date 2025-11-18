/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const ButtonDeny = ({
    children,
    block,
    type,
    color = 'red',
    className,
    onClick,
    ...props
}) => (
    <button
        type={type}
        className={classNames('button-deny', className, {
            [`is-${color}`]: color,
            'button-deny--block': block,
        })}
        onClick={onClick}
        {...props}
    >
        {children}
    </button>
);

export default ButtonDeny;

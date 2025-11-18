/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import add from '@/images/add.png';

const Button = ({
    icon,
    rounded,
    color,
    larger,
    type,
    close,
    margin,
    medium,
    onClick,
    children,
    mobileFull,
    hasOpacity,
    disabled,
    modifier,
    ...props
}) => (
    <button
        type={type}
        className={classNames('button', color, mobileFull, {
            [`button--${modifier}`]: modifier,
            'rounded': rounded,
            'larger': larger,
            'close': close,
            'margin': margin,
            'medium': medium,
            'has-opacity': hasOpacity,
        })}
        disabled={disabled}
        onClick={onClick}
        {...props}
    >
        {icon && <img src={add} alt="plus" width="14" height="13" />}
        {children}
    </button>
);

export default Button;

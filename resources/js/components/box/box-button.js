/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const BoxButton = ({
    children,
    className,
    checked,
    unborderless = false,
    icon,
    add,
    addTask,
    rounded,
    subtask,
    isBorderBlue,
    noPadding,
    color,
    modifier,
    ...props
}) => (
    <button
        type="button"
        className={classNames('box__button', className, {
            'checked': checked,
            'unborderless': unborderless,
            'icon': icon,
            'add': add,
            'add-task': addTask,
            'rounded': rounded,
            'subtask': subtask,
            'is-border-blue': isBorderBlue,
            'is-padding-zero': noPadding,
            [`is-${color}`]: color,
            [`box__button--${modifier}`]: modifier,
        })}
        {...props}
    >
        {children}
    </button>
);

export default BoxButton;

/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const ProjectItemButton = ({
    children,
    className,
    onClick,
    larger,
    color,
    ...props
}) => (
    <button
        type="button"
        className={classNames('project__item-button', className, {
            larger: larger,
            [`is-${color}`]: color,
        })}
        onClick={onClick}
        {...props}
    >
        {children}
    </button>
);

export default ProjectItemButton;

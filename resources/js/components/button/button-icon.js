/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';

const ButtonIcon = ({ to, iconType, color, hidden, hasBorder, onClick }) => {
    const commonProps = {
        className: classNames('button-icon', color, {
            'is-hidden': hidden,
            'has-border': hasBorder,
        }),
    };

    return to ? (
        <NavLink to={to} {...commonProps}>
            <Icon type={iconType} />
        </NavLink>
    ) : (
        <button type="button" onClick={onClick} {...commonProps}>
            <Icon type={iconType} />
        </button>
    );
};

export default ButtonIcon;

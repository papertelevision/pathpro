/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import SubheaderLeft from '@app/components/subheader/subheader-left';
import SubheaderRight from '@app/components/subheader/subheader-right';

const Subheader = ({ children, modifier, color }) => (
    <div
        className={classNames('subheader', {
            [`subheader--${modifier}`]: modifier,
            [`is-${color}`]: color,
        })}
    >
        {children}
    </div>
);

Subheader.Left = SubheaderLeft;
Subheader.Right = SubheaderRight;

export default Subheader;

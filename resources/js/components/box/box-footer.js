/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import BoxFooterLeft from '@app/components/box/box-footer-left';
import BoxFooterRight from '@app/components/box/box-footer-right';

const BoxFooter = ({ children, centered, between, larger }) => (
    <div
        className={classNames('box__footer', {
            centered: centered,
            between: between,
            larger: larger,
        })}
    >
        {children}
    </div>
);

BoxFooter.Left = BoxFooterLeft;
BoxFooter.Right = BoxFooterRight;

export default BoxFooter;

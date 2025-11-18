/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import BoxHeaderLeft from '@app/components/box/box-header-left';
import BoxHeaderRight from '@app/components/box/box-header-right';

const BoxHeader = ({ children }) => (
    <div className="box__header">{children}</div>
);

BoxHeader.Left = BoxHeaderLeft;
BoxHeader.Right = BoxHeaderRight;

export default BoxHeader;

/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import GroupHeaderLeft from '@app/components/group/group-header-left';
import GroupHeaderRight from '@app/components/group/group-header-right';

const GroupHeader = ({ children, color }) => (
    <div className="group__header" style={{ background: color }}>
        {children}
    </div>
);

GroupHeader.Left = GroupHeaderLeft;
GroupHeader.Right = GroupHeaderRight;

export default GroupHeader;

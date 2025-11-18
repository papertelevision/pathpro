/**
 * External dependencies
 */
import React from 'react';

const GroupHeaderLeft = ({ description, children }) => (
    <div
        className="group__header-left"
        data-tooltip-id="tooltip"
        data-tooltip-variant="light"
        data-tooltip-place="bottom"
        data-tooltip-html={
            description &&
            `<div class="react-tooltip--group">${description}</div>`
        }
        data-tooltip-float
    >
        {children}
    </div>
);

export default GroupHeaderLeft;

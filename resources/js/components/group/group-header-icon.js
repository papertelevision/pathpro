/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';
import { getIconById } from '@app/lib/heroicons-library';

const GroupHeaderIcon = ({ iconUrl, iconType, predefinedIconType, predefinedIconIdentifier }) => {
    // Render predefined Heroicon if available
    if (predefinedIconType === 'predefined' && predefinedIconIdentifier) {
        const IconComponent = getIconById(predefinedIconIdentifier);
        if (IconComponent) {
            return (
                <div className="group__header-icon">
                    <IconComponent className="group__header-icon-heroicon" />
                </div>
            );
        }
    }

    // Fall back to uploaded or legacy icon
    return (
        <div className="group__header-icon">
            {iconUrl && <img src={iconUrl} alt="Icon" />}
            {iconType && <Icon type={iconType} />}
        </div>
    );
};

export default GroupHeaderIcon;

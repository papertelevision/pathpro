/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import BoxButton from '@app/components/box/box-button';
import Icon from '@app/components/icon/icon';
import { useSubdomain } from '@app/lib/domain';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const BoxButtonShare = ({
    text,
    shareUrl = '',
    shareObject,
    type = 'light',
    dataTip,
    page,
    ...props
}) => {
    const {
        setIsPopupNotificationVisible,
        setPopupNotificationText,
        setPopupNotificationColor,
    } = usePopupNotificationContext();

    const copyToClipboard = () => {
        const copy = require('clipboard-copy');
        let link =
            shareObject === 'project'
                ? useSubdomain(shareUrl, page)
                : new URL(window.location.href).origin + shareUrl;

        copy(link);
        setPopupNotificationColor('blue');
        setPopupNotificationText('Link Copied !');
        setIsPopupNotificationVisible(true);
    };

    return (
        <BoxButton
            data-tooltip-id="tooltip"
            data-tooltip-content={
                dataTip || `Copy link to this ${shareObject} for sharing`
            }
            data-tooltip-float
            data-tooltip-variant={type}
            data-tooltip-attr="share"
            data-tooltip-place="bottom"
            onClick={() => copyToClipboard()}
            {...props}
        >
            {text || <Icon type="share" />}
        </BoxButton>
    );
};

export default BoxButtonShare;

/**
 * External dependencies
 */
import React, { Fragment } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';

const PopupNotification = ({
    children,
    isVisible,
    color,
    isErrorNotification,
}) => {
    if (!isVisible) return null;

    return ReactDOM.createPortal(
        <>
            <div
                className={classNames('popup-notification', color, {
                    'is-visible': isVisible,
                })}
            >
                {!isErrorNotification ? (
                    <Fragment>
                        <Icon type="check_circle" /> {children}
                    </Fragment>
                ) : (
                    <Fragment>
                        <Icon type="warning_sign" /> {children}
                    </Fragment>
                )}
            </div>
        </>,
        document.getElementById('popup-notification')
    );
};

export default PopupNotification;

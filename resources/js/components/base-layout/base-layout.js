/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Sidebar from '@app/components/sidebar/sidebar';
import Tooltip from '@app/components/tooltip/tooltip';
import PopupNotification from '@app/components/popup-notification/popup-notification';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';
import useProjectShowQuery from '@app/data/project/use-project-show-query';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const BaseLayout = ({
    children,
    modifier,
    hideFooter = false,
    hideSidebar = false,
}) => {
    const { isUserLoggedIn, authUser } = usePermissionsContextApi();
    const {
        isPopupNotificationVisible,
        popupNotificationText,
        popupNotificationColor,
    } = usePopupNotificationContext();
    const { data: project } = useProjectShowQuery(projectSlug);

    useEffect(() => {
        if (project?.accent_color) {
            document.documentElement.style.setProperty(
                '--project-accent-color',
                project.accent_color
            );
        }
    }, [project?.accent_color]);

    return (
        <div
            className={classNames('base-layout', {
                'is-extended': !isUserLoggedIn || hideSidebar,
                [`base-layout--${modifier}`]: modifier,
            })}
        >
            {isUserLoggedIn && !hideSidebar && <Sidebar />}

            <div className="base-layout__main">
                {children}

                {!hideFooter && !authUser?.is_page_white_labeled && (
                    <footer className="footer">
                        <span>
                            Powered by{' '}
                            <NavLink
                                to="https://app.pathpro.co/login"
                                target="_blank"
                            >
                                PathPro
                            </NavLink>
                        </span>
                    </footer>
                )}
            </div>

            <Tooltip />

            <PopupNotification
                isVisible={isPopupNotificationVisible}
                color={popupNotificationColor}
                isErrorNotification={popupNotificationColor === 'red'}
            >
                {popupNotificationText}
            </PopupNotification>
        </div>
    );
};

export default BaseLayout;

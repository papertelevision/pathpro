/**
 * External dependencies
 */
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';
import useLogoutMutation from '@app/data/logout/use-logout-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const AccountMenu = ({ setIsAccountMenuVisible, isVisible }) => {
    const wrapperRef = useRef();

    const { authUser } = usePermissionsContextApi();

    const { mutate: mutateUseLogout } = useLogoutMutation();

    const handleClickOutsideAccountMenu = (e) => {
        if (wrapperRef.current?.contains(e.target)) {
            return;
        }

        setIsAccountMenuVisible(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideAccountMenu);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutsideAccountMenu
            );
        };
    }, []);

    return (
        <div
            className={classNames('account-menu', {
                'is-visible': isVisible,
            })}
            ref={wrapperRef}
        >
            <div className="account-menu__header">
                <div className="account-menu__header-left">
                    <NavLink
                        to="/account"
                        onClick={() => setIsAccountMenuVisible(false)}
                        end
                    >
                        {authUser.avatar && !authUser.avatar.includes('user-default-img.png') ? (
                            <img src={authUser.avatar} alt="Logged User Avatar" />
                        ) : (
                            <div className="user-avatar-initials">
                                {authUser.username?.charAt(0).toUpperCase() || '?'}
                            </div>
                        )}
                    </NavLink>
                </div>
                <div className="account-menu__header-right">
                    <ul>
                        <li>
                            <NavLink
                                to="/account"
                                onClick={() => setIsAccountMenuVisible(false)}
                                end
                            >
                                {authUser.username}
                            </NavLink>
                        </li>
                        <li>{authUser.email}</li>
                    </ul>
                </div>
            </div>
            <div className="account-menu__content">
                <div className="account-menu__content-group">
                    <Icon type="user_account" />
                    <NavLink
                        to="/account"
                        onClick={() => setIsAccountMenuVisible(false)}
                        end
                    >
                        Account
                    </NavLink>
                </div>
            </div>
            <div className="account-menu__footer">
                <button
                    className="account-menu__button"
                    type="button"
                    onClick={mutateUseLogout}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default AccountMenu;

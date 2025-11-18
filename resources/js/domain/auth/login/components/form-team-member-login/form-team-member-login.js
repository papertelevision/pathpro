/**
 * External dependencies
 */
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { parse } from 'qs';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';
import useLoginMutation from '@app/data/auth/login/use-login-mutation';
import ButtonSocialite from '@app/domain/auth/login/components/button-socialite/button-socialite';
import BaseLayout from '@app/components/base-layout/base-layout';
import useTeamMemberInvitationDestroyMutation from '@app/data/team-member-invitation/use-team-member-invitation-destroy-mutation';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';

const FormTeamMemberLogin = () => {
    const [isLoginFailed, setIsLoginFailed] = useState(false);

    const location = useLocation();
    const { invitation, token } = parse(location.search, {
        ignoreQueryPrefix: true,
    });

    const { mutate: mutateDestroyInvitation } =
        useTeamMemberInvitationDestroyMutation(invitation);

    const { selectedValue } = useHeaderSelectContext();
    const { mutate: mutateUseLogin } = useLoginMutation(selectedValue);

    const onSubmit = (e) => {
        e.preventDefault();

        const userLoginCredentials = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        mutateUseLogin(userLoginCredentials, {
            onSuccess: () => {
                mutateDestroyInvitation({
                    token: token,
                });
            },
            onError: () => {
                setIsLoginFailed(true);
            },
        });
    };

    return (
        <BaseLayout modifier="centered" hideFooter>
            <div className="login">
                <form method="POST" onSubmit={onSubmit}>
                    <div className="login__container">
                        <div className="login__header">
                            <h2 className="login__header-title">Log in</h2>
                        </div>
                        <div
                            className={classNames('login__failed', {
                                'is-hidden': !isLoginFailed,
                            })}
                        >
                            <Icon type="warning_sign" />
                            <p>Incorrect email address or password.</p>
                            <button
                                type="button"
                                className="login__cancel"
                                onClick={() => setIsLoginFailed(false)}
                            ></button>
                        </div>
                        <div className="login__group">
                            <label
                                className="login__group-label"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="login__field"
                                id="email"
                                placeholder="joe@email.com"
                                required
                            />
                        </div>
                        <div className="login__group">
                            <label
                                className="login__group-label"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="login__field"
                                id="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="login__group login__group--center-items">
                            <button type="submit" className="login__button">
                                Login
                            </button>
                        </div>
                        <div className="login__group login__group--center-items">
                            <NavLink
                                to="/forgot-password"
                                end
                                className="login_nav-link"
                            >
                                Forgot password?
                            </NavLink>
                        </div>
                        <div className="login__group login__group--center-items">
                            <ButtonSocialite type="google" />
                        </div>
                        <div className="login__group login__group--center-items">
                            <ButtonSocialite type="facebook" />
                        </div>
                    </div>
                </form>
            </div>
        </BaseLayout>
    );
};

export default FormTeamMemberLogin;

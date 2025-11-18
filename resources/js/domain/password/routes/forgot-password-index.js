/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import BaseLayout from '@app/components/base-layout/base-layout';
import Icon from '@app/components/icon/icon';
import usePasswordForgotMutation from '@app/data/password-reset/use-password-forgot-mutation';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const ForgotPasswordIndex = () => {
    const [resetPasswordFailedMessage, setResetPasswordFailedMessage] =
        useState('');
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();
    const { mutate: mutatePasswordForgot } = usePasswordForgotMutation();

    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const userCreateNewPasswordCredentials = {
            email: e.target.email.value,
        };

        mutatePasswordForgot(userCreateNewPasswordCredentials, {
            onSuccess: () => {
                setPopupNotificationText(
                    'Password reset link send successfully!'
                );
                setIsPopupNotificationVisible(true);
                navigate('/login');
            },
            onError: (error) =>
                setResetPasswordFailedMessage(error.response.data.message),
        });
    };

    return (
        <BaseLayout modifier="centered" hideFooter>
            <div className="login">
                <form method="POST" onSubmit={onSubmit}>
                    <div className="login__container">
                        <div className="login__header">
                            <h2 className="login__header-title">
                                Reset your password
                            </h2>
                        </div>
                        <div
                            className={classNames('login__failed', {
                                'is-hidden': !resetPasswordFailedMessage,
                            })}
                        >
                            <Icon type="warning_sign" />
                            <p>{resetPasswordFailedMessage}</p>
                            <button
                                className="login__cancel"
                                onClick={() =>
                                    setResetPasswordFailedMessage('')
                                }
                            ></button>
                        </div>
                        <div className="login__group">
                            <label
                                className="login__group-label"
                                htmlFor="email"
                            >
                                Enter your user account's verified email address
                                and we will send you a password reset link.
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
                            <button type="submit" className="login__button">
                                Send password reset email
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </BaseLayout>
    );
};

export default ForgotPasswordIndex;

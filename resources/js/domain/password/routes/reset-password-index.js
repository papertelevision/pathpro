/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import BaseLayout from '@app/components/base-layout/base-layout';
import Icon from '@app/components/icon/icon';
import usePasswordUpdateMutation from '@app/data/password-reset/use-password-update-mutation';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const ResetPasswordIndex = () => {
    const [
        isResetPasswordFailedMessage,
        setIsResetPasswordFailedMessageMessage,
    ] = useState(false);

    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();

    const navigate = useNavigate();
    const { email } = useParams();

    const { mutate: mutatePasswordUpdate } = usePasswordUpdateMutation(email);

    const onSubmit = (e) => {
        e.preventDefault();

        if (e.target.confirm_password.value !== e.target.password.value) {
            setIsResetPasswordFailedMessageMessage('Passwords do not match!');
        } else {
            mutatePasswordUpdate(
                {
                    password: e.target.password.value,
                },
                {
                    onSuccess: () => {
                        setPopupNotificationText(
                            'The password was reset successfully!'
                        );
                        setIsPopupNotificationVisible(true);
                        navigate('/login');
                    },
                    onError: () => {
                        setIsResetPasswordFailedMessageMessage(
                            'Failed to reset the password!'
                        );
                    },
                }
            );
        }
    };

    return (
        <BaseLayout modifier="centered" hideFooter>
            <div className="login">
                <form method="POST" onSubmit={onSubmit}>
                    <div className="login__container">
                        <div className="login__header">
                            <h2 className="login__header-title">
                                Create new password
                            </h2>
                        </div>
                        <div
                            className={classNames('login__failed', {
                                'is-hidden': !isResetPasswordFailedMessage,
                            })}
                        >
                            <Icon type="warning_sign" />
                            <p>{isResetPasswordFailedMessage}</p>
                            <button
                                className="login__cancel"
                                type="button"
                                onClick={() =>
                                    setIsResetPasswordFailedMessageMessage()
                                }
                            ></button>
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
                                id="password"
                                className="login__field"
                                placeholder="Enter your new password"
                                required
                            />
                        </div>
                        <div className="login__group">
                            <label
                                className="login__group-label"
                                htmlFor="password"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirm_password"
                                id="confirm_password"
                                className="login__field"
                                placeholder="Confirm your new password"
                                required
                            />
                        </div>
                        <div className="login__group login__group--center-items">
                            <button type="submit" className="login__button">
                                Reset password
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </BaseLayout>
    );
};

export default ResetPasswordIndex;

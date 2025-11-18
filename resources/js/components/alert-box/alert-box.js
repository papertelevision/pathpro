/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';

const AlertBox = ({
    isActive,
    setOpenAlertBox,
    setFormIndex,
    setFormIndexToZero,
    setFormIndexToThree,
    setIsModalOpen,
    deleteAction,
    message,
    modifier,
    urlAddress,
    confirmButtonType = 'submit',
    additionalActions,
}) => {
    const navigate = useNavigate();

    const handleConfirmAction = () => {
        Cookies.remove('openModal');

        if (deleteAction) {
            deleteAction();
        } else {
            setOpenAlertBox(false);
            setFormIndexToZero && setFormIndexToZero(0);
            setFormIndex && setFormIndex(1);
            setIsModalOpen(false);
            navigate(urlAddress);
        }
    };

    const handleCancelAction = () => {
        if (deleteAction) {
            setOpenAlertBox(false);
        } else {
            setOpenAlertBox(false);
            setFormIndexToZero && setFormIndexToZero(0);
            setFormIndex && setFormIndex(1);
            setFormIndexToThree && setFormIndexToThree(3);
            setIsModalOpen(true);
        }
    };

    return (
        <div
            className={classNames('alert-box', {
                'is-active': isActive,
                [`alert-box--${modifier}`]: modifier,
            })}
        >
            <div className="alert-box__content">
                <div className="alert-box__header">
                    <span className="alert-box__title">Confirm</span>
                    <button
                        className="alert-box__button"
                        onClick={handleCancelAction}
                    >
                        <span></span>
                    </button>
                </div>
                <div className="alert-box__message">
                    <p dangerouslySetInnerHTML={{ __html: message }} />
                    {additionalActions &&
                        additionalActions.map((action) => (
                            <div
                                key={action.title}
                                className="alert-box__message__action"
                            >
                                <div className="alert-box__message__action__inner">
                                    <input
                                        id={action.title}
                                        type="checkbox"
                                        onChange={action.handler}
                                    />
                                    <label htmlFor={action.title}>
                                        {action.title}
                                    </label>
                                </div>
                                <small
                                    dangerouslySetInnerHTML={{
                                        __html: action.description,
                                    }}
                                />
                            </div>
                        ))}
                </div>
                <div className="alert-box__footer">
                    <Button
                        type="button"
                        color="red-text"
                        onClick={handleCancelAction}
                    >
                        Cancel
                    </Button>
                    <Button
                        type={confirmButtonType}
                        rounded
                        larger
                        color="blue"
                        onClick={handleConfirmAction}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AlertBox;

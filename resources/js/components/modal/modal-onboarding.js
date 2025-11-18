/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import Button from '@app/components/button/button';
import Icon from '@app/components/icon/icon';
import TooltipOnboarding from '@app/components/tooltip/tooltip-onboarding';
import useAuthenticatedUserFinishOnboardingMutation from '@app/data/user/use-authenticated-user-finish-onboarding-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const data = {
    welcome: [
        <h4 key="title">Hello, Welcome to Your Dashboard!</h4>,
        <p key="text">
            You're currently viewing your dashboard, an overview of your
            Products / Projects, your Team, and your overall Community. To get
            started, we recommend taking a brief tour of all core features!
        </p>,
    ],
    conclude: [
        <Icon key="icon" type="high_five" />,
        <h4 key="title">That Concludes the Overview Tour!</h4>,
        <p key="text">
            Congrats! You now have the basics on how things work! The next step
            is to create your first project. Projects are at the core of this
            experience, and typically revolve around a single product.
        </p>,
        <p key="note">
            <b>
                We highly recommend creating your first Project now, and we’ll
                walk you through the process below:
            </b>
        </p>,
    ],
};

const ModalOnBoarding = ({
    isOpen,
    setIsOpen,
    isOnboardingActive,
    setIsOnboardingActive,
}) => {
    const { authUser } = usePermissionsContextApi();

    const [type, setType] = useState('welcome');
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const navigate = useNavigate();

    const { mutate: mutateFinishOnboarding } =
        useAuthenticatedUserFinishOnboardingMutation();

    const handleOpenConcludeModal = () => {
        setType('conclude');
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        !authUser.has_finished_onboarding &&
            localStorage.setItem('onboardingSkipped', true);
        setIsOpen(false);
        setIsOnboardingActive(false);
    };

    useEffect(() => {
        isOpen && localStorage.removeItem('onboardingRestarted');
    }, [isOpen]);

    return (
        <>
            <Modal
                modifier={`onboarding ${type}`}
                closeModal={handleCloseModal}
                modalIsOpen={isOpen}
                setIsModalOpen={setIsOpen}
                disableOutsideClick
            >
                <Modal.Content>
                    <div className="modal__content-wrapper">
                        <div className="modal__content-text">{data[type]}</div>
                        <div className="modal__content-button-wrapper">
                            <Button
                                type="button"
                                modifier="rectangular"
                                color="is-blue"
                                onClick={() => {
                                    if (type === 'welcome') {
                                        localStorage.setItem(
                                            'onboardingSkipped',
                                            true
                                        );
                                        setIsOpen(false);
                                        setIsTooltipVisible(true);
                                    } else {
                                        setIsOnboardingActive(false);
                                        navigate('/projects', {
                                            state: {
                                                currentlySubscribed: true,
                                            },
                                        });
                                    }
                                }}
                            >
                                {type === 'welcome'
                                    ? 'Take a Tour!'
                                    : 'Create a Project!'}
                            </Button>
                            <Button
                                type="button"
                                color="red-text"
                                onClick={handleCloseModal}
                            >
                                {type === 'welcome'
                                    ? 'Skip for now (not recommended)'
                                    : 'Skip and return to Dashboard'}
                            </Button>
                        </div>
                        {type === 'welcome' && (
                            <div className="modal__content-actions">
                                <div className="modal__checkbox">
                                    <input
                                        id="snooze"
                                        type="checkbox"
                                        onChange={(e) =>
                                            mutateFinishOnboarding({
                                                has_finished_onboarding:
                                                    e.target.checked,
                                            })
                                        }
                                        defaultChecked={
                                            authUser.has_finished_onboarding
                                        }
                                    />
                                    <label htmlFor="snooze">
                                        Don't show this message again
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Content>
            </Modal>
            <TooltipOnboarding
                isVisible={isTooltipVisible}
                setIsVisible={setIsTooltipVisible}
                openModal={handleOpenConcludeModal}
                closeModal={handleCloseModal}
                isOnboardingActive={isOnboardingActive}
            />
        </>
    );
};

export default ModalOnBoarding;

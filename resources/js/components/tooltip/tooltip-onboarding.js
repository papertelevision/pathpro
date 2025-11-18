/**
 * External dependencies
 */
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import AlertBox from '@app/components/alert-box/alert-box';
import Button from '@app/components/button/button';
import { tooltipOnboardingContent } from '@app/components/tooltip/tooltip-onboarding-content';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

// react-tooltip package issue
// The tooltip visibility must be dynamically updated after the tooltip is
// rendered for the first time. This is because the tooltip position is not
// updating when the selected anchor has the same left position as the
// previous one. This is done in the first useEffect hook.

const TooltipOnboarding = ({
    isVisible,
    setIsVisible,
    openModal,
    closeModal,
    isOnboardingActive,
}) => {
    const { authUser } = usePermissionsContextApi();

    const [currentStep, setCurrentStep] = useState(0);
    const [openAlertBox, setOpenAlertBox] = useState(false);

    const handleOnNextClick = () => {
        if (currentStep === 7) {
            setIsVisible(false);
            openModal();
        } else {
            setIsVisible(false);
            setCurrentStep((ps) => ps + 1);
        }
    };

    useEffect(() => {
        currentStep !== 0 && setIsVisible(true);
    }, [currentStep]);

    useEffect(() => {
        if (authUser.has_to_create_project && !isOnboardingActive) {
            setCurrentStep(8);
            setIsVisible(true);
        }
    }, [authUser, isOnboardingActive]);

    if (!isVisible) {
        return null;
    }

    return (
        <>
            <ReactTooltip
                id="tooltip"
                className="react-tooltip--onboarding"
                role="dialog"
                variant="light"
                clickable
                float={false}
                opacity={1}
                isOpen={isVisible}
                offset={tooltipOnboardingContent[currentStep].offset}
                place={tooltipOnboardingContent[currentStep].position}
                anchorSelect={tooltipOnboardingContent[currentStep].anchor}
                render={() => (
                    <>
                        {tooltipOnboardingContent[currentStep].html}
                        {tooltipOnboardingContent[currentStep].showButtons && (
                            <div className="react-tooltip__footer">
                                <Button
                                    type="button"
                                    color="red-text"
                                    onClick={() => setOpenAlertBox(true)}
                                >
                                    Cancel Tour
                                </Button>
                                <Button
                                    rounded
                                    larger
                                    color="blue"
                                    onClick={handleOnNextClick}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            />
            <AlertBox
                isActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                setIsModalOpen={setIsVisible}
                deleteAction={() => {
                    closeModal();
                    setOpenAlertBox(false);
                    setIsVisible(false);
                }}
                message="Are you sure you want to cancel the tour?"
            />
        </>
    );
};

export default TooltipOnboarding;

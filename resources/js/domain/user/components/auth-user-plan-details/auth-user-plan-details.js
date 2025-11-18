/**
 * External dependencies
 */
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';
import Modal from '@app/components/modal/modal';
import FormStripeEditPaymentDetails from '@app/domain/stripe/components/form-stripe-edit-payment-details/form-stripe-edit-payment-details';
import SectionStripeProducts from '@app/domain/stripe/components/section-stripe-products/section-stripe-products';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const AuthUserPlanDetails = () => {
    const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
    const [isEditPaymentDetailsModalOpen, setIsEditPaymentDetailsModalOpen] =
        useState(false);
    const {
        authUser: { plan, pm_last_four },
    } = usePermissionsContextApi();

    return (
        <div className="holder-details">
            <div className="holder-details__header">
                <h5>
                    Plan Details{' '}
                    {plan.is_provider_stripe && (
                        <small>
                            (Plan Renews{' '}
                            {plan?.subscription?.current_period_end})
                        </small>
                    )}
                </h5>
                {plan.is_provider_stripe && (
                    <Button
                        type="button"
                        rounded
                        color="blue"
                        onClick={() => setIsEditPlanModalOpen(true)}
                    >
                        Edit/Upgrade Plan
                    </Button>
                )}
            </div>
            <div className="holder-details__body">
                <>
                    <h2>
                        {plan.name} {plan.is_provider_appsumo && '(AppSumo)'}
                    </h2>
                    <h1>
                        {plan.is_provider_stripe ? (
                            <>
                                <strong>
                                    ${plan?.subscription?.amount_due}
                                </strong>{' '}
                                {`USD / ${
                                    plan?.subscription?.is_monthly
                                        ? 'mo.'
                                        : 'yr.'
                                }`}
                            </>
                        ) : (
                            <strong>${plan.price}</strong>
                        )}
                    </h1>
                    <h3>
                        INCLUDED IN {plan.name}
                        {plan.is_free ? ' PLAN:' : ':'}
                    </h3>
                    <ul>
                        {plan.features.length > 0 ? (
                            <>
                                <li>
                                    {plan.projects_count}{' '}
                                    {plan.is_provider_stripe
                                        ? 'Product'
                                        : 'Project'}
                                    {plan.projects_count !== 1 && 's'}
                                    {plan.projects_count !== 'UNLIMITED' &&
                                        ' with:'}
                                </li>
                                <ul>
                                    {plan.features?.map((feature) => (
                                        <li key={feature}>
                                            {parse(DOMPurify.sanitize(feature))}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <li>{plan.projects_count} Projects</li>
                        )}
                        <li>
                            {plan.community_members_count} Community Members
                        </li>
                        {(plan.team_members_count > 0 ||
                            plan.team_members_count === 'UNLIMITED') && (
                            <li>{plan.team_members_count} Team Members</li>
                        )}
                        {plan.tech_support_type && (
                            <li>{plan.tech_support_type}</li>
                        )}
                    </ul>
                </>
            </div>

            <div className="holder-details__footer">
                {plan.is_provider_stripe ? (
                    <>
                        <h5>Payment Details</h5>
                        <strong>**** **** {pm_last_four}</strong>
                        <Button
                            type="button"
                            rounded
                            color="black"
                            mobileFull
                            onClick={() =>
                                setIsEditPaymentDetailsModalOpen(true)
                            }
                        >
                            Edit Payment Details
                        </Button>
                    </>
                ) : (
                    <Button
                        type="button"
                        rounded
                        larger
                        color="blue"
                        onClick={() =>
                            window.open(
                                'https://appsumo.com/account/products/',
                                '_blank',
                                'noopener,noreferrer'
                            )
                        }
                    >
                        Manage Plan
                    </Button>
                )}
            </div>

            {plan.is_provider_stripe && (
                <>
                    <Modal
                        className="full-height"
                        modifier="stripe-products"
                        modalIsOpen={isEditPlanModalOpen}
                        setIsModalOpen={setIsEditPlanModalOpen}
                        closeModal={() => setIsEditPlanModalOpen(false)}
                    >
                        <Modal.Content>
                            <Modal.Header
                                className="is-white"
                                closeModal={() => setIsEditPlanModalOpen(false)}
                            >
                                <div className="modal__header-left"></div>
                            </Modal.Header>
                            <SectionStripeProducts />
                        </Modal.Content>
                    </Modal>

                    <Modal
                        className="full-height"
                        modifier="edit-payment-details"
                        modalIsOpen={isEditPaymentDetailsModalOpen}
                        setIsModalOpen={setIsEditPaymentDetailsModalOpen}
                        closeModal={() =>
                            setIsEditPaymentDetailsModalOpen(false)
                        }
                    >
                        <Modal.Content>
                            <Modal.Header
                                className="is-white"
                                closeModal={() =>
                                    setIsEditPaymentDetailsModalOpen(false)
                                }
                            >
                                <div className="modal__header-left"></div>
                            </Modal.Header>
                            <FormStripeEditPaymentDetails
                                setIsModalOpen={
                                    setIsEditPaymentDetailsModalOpen
                                }
                            />
                        </Modal.Content>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default AuthUserPlanDetails;

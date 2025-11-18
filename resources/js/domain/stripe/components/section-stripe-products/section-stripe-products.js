/**
 * External dependencies
 */
import React, { useState } from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';
import Modal from '@app/components/modal/modal';
import Loader from '@app/components/loader/loader';
import useStripeSubscriptionUpdateMutation from '@app/data/stripe/use-stripe-subscription-update-mutation';
import useStripeAuthUserProductsIndexQuery from '@app/data/stripe/use-stripe-auth-user-products-index-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';

const modalMessages = {
    projects:
        "Are you sure you want to downgrade your plan? You currently have more Projects than the selected plan allows. In order to downgrade, please delete any additional Projects above this plan's limitations before proceeding.",
    teamMembers:
        "Are you sure you want to downgrade your plan? You currently have more Team Members than the selected plan allows. In order to downgrade, please delete any additional Team Members above this plan's limitations before proceeding.",
    communityMembers:
        "Are you sure you want to downgrade your plan? You currently have more Community Members than the selected plan allows. In order to downgrade, please delete any additional Community Members above this plan's limitations before proceeding.",
};

const SectionStripeProducts = () => {
    const { authUser } = usePermissionsContextApi();
    const { selectedValue } = useHeaderSelectContext();
    const { data: stripeProducts, isLoading: isStripeProductsQueryLoading } =
        useStripeAuthUserProductsIndexQuery();

    const {
        isLoading: isStripeSubscriptionMutationLoading,
        mutate: mutateStripeSubscriptionUpdate,
    } = useStripeSubscriptionUpdateMutation(selectedValue);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showMonthlyProducts, setShowMonthlyProducts] = useState(
        authUser.plan?.subscription?.is_monthly
    );

    const handleUpdateStripeSubscription = (selectedStripeProduct) => {
        const {
            plan,
            projects_count,
            team_members_count,
            community_members_count,
        } = authUser;

        const currentStripeProduct = plan;
        let modalMessage = null;

        if (currentStripeProduct?.is_free) {
            return window.open(
                `/stripe-purchase-product/${
                    selectedStripeProduct.slug
                }/billing?subscription-type=${
                    showMonthlyProducts ? 'monthly' : 'yearly'
                }`,
                '_blank'
            );
        }

        if (projects_count > selectedStripeProduct.projects_count) {
            modalMessage = modalMessages.projects;
        } else if (
            team_members_count > selectedStripeProduct.team_members_count
        ) {
            modalMessage = modalMessages.teamMembers;
        } else if (
            community_members_count >
            selectedStripeProduct.community_members_count
        ) {
            modalMessage = modalMessages.communityMembers;
        }

        if (modalMessage) {
            setIsModalOpen(true);
            setModalMessage(modalMessage);
        } else {
            mutateStripeSubscriptionUpdate({
                stripeProductId: selectedStripeProduct.id,
                isMonthly: showMonthlyProducts,
            });
        }
    };

    if (isStripeProductsQueryLoading) {
        return <Loader white fixed />;
    }

    return (
        <section className="section section--stripe-products">
            <div className="section__header">
                <div className="section__header__row">
                    <h2>
                        Update Your PathPro
                        {showMonthlyProducts ? ' Monthly ' : ' Yearly '}
                        Plan
                    </h2>
                    <p>
                        You can change your plan anytime below. Note that when
                        upgrading, you will be charged the difference between
                        your current plan and the new one. When downgrading, you
                        will automatically be switched to the lesser plan after
                        your current plan ends.
                    </p>
                </div>
            </div>
            <div className="section__nav">
                <ul>
                    <li className={showMonthlyProducts ? 'is-current' : ''}>
                        <button onClick={() => setShowMonthlyProducts(true)}>
                            Pay Monthly
                        </button>
                    </li>
                    <li className={showMonthlyProducts ? '' : 'is-current'}>
                        <button onClick={() => setShowMonthlyProducts(false)}>
                            Pay Yearly & SAVE!
                        </button>
                    </li>
                    <div className="section__nav-animation"></div>
                </ul>
            </div>
            <div className="section__body">
                {stripeProducts.map((stripeProduct) => (
                    <div key={stripeProduct.id} className="section__col">
                        <div
                            className={classNames('section__col-inner', {
                                'is-recommended': stripeProduct.is_recommended,
                            })}
                        >
                            <div className="section__row">
                                <div
                                    className={classNames('section__row-text', {
                                        'section__row-text--yearly':
                                            !authUser.plan?.subscription
                                                ?.is_monthly,
                                    })}
                                >
                                    <h2>{stripeProduct.name}</h2>
                                    {showMonthlyProducts ? (
                                        <h1>
                                            <strong>
                                                ${stripeProduct.monthly_price}
                                            </strong>{' '}
                                            USD / mo.
                                        </h1>
                                    ) : (
                                        <>
                                            <h1>
                                                <span
                                                    className={classNames({
                                                        'is-invisible':
                                                            stripeProduct.is_free,
                                                    })}
                                                >
                                                    $
                                                    {
                                                        stripeProduct.monthly_price
                                                    }
                                                </span>
                                                <strong>
                                                    $
                                                    {
                                                        stripeProduct.discounted_monthly_price
                                                    }
                                                </strong>{' '}
                                                USD / mo.
                                            </h1>
                                            <h6
                                                className={classNames({
                                                    'is-invisible':
                                                        stripeProduct.is_free,
                                                })}
                                            >
                                                {
                                                    stripeProduct.yearly_discount_percentage
                                                }
                                                % Savings!
                                            </h6>
                                        </>
                                    )}
                                    {parse(
                                        DOMPurify.sanitize(
                                            stripeProduct.description
                                        )
                                    )}
                                </div>
                                <div className="section__row-actions">
                                    {isStripeSubscriptionMutationLoading ? (
                                        <Loader white />
                                    ) : stripeProduct.id ===
                                          authUser.plan?.id &&
                                      authUser.plan?.subscription
                                          ?.is_monthly ===
                                          showMonthlyProducts ? (
                                        <Button
                                            type="button"
                                            modifier="rectangular"
                                            color="is-blue"
                                        >
                                            YOUR PLAN
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            modifier="rectangular"
                                            color="is-white"
                                            onClick={() =>
                                                handleUpdateStripeSubscription(
                                                    stripeProduct
                                                )
                                            }
                                        >
                                            Switch Plan
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="section__row">
                                <h3>
                                    INCLUDED IN {stripeProduct.name}
                                    {stripeProduct.is_free ? ' PLAN:' : ':'}
                                </h3>
                                <ul>
                                    <li>
                                        {`${stripeProduct.projects_count} ${
                                            stripeProduct.projects_count !== 1
                                                ? 'Projects/Products'
                                                : 'Project/Product'
                                        } with:`}
                                    </li>
                                    <ul>
                                        {stripeProduct.features?.map(
                                            (feature) => (
                                                <li key={feature}>{feature}</li>
                                            )
                                        )}
                                    </ul>
                                    <li>
                                        {stripeProduct.community_members_count}{' '}
                                        Community Members
                                    </li>
                                    {(stripeProduct.team_members_count > 0 ||
                                        stripeProduct.team_members_count ===
                                            'UNLIMITED') && (
                                        <li>
                                            {stripeProduct.team_members_count}{' '}
                                            Team Members
                                        </li>
                                    )}
                                    <li>{stripeProduct.tech_support_type}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                medium
                modalIsOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                closeModal={() => setIsModalOpen(false)}
            >
                <Modal.Content>
                    <Modal.Header
                        className="is-white"
                        closeModal={() => setIsModalOpen(false)}
                    >
                        <div className="modal__header-left"></div>
                    </Modal.Header>
                    <div className="modal__content-wrapper">
                        <div className="modal__content-text">
                            <p>{modalMessage}</p>
                        </div>
                        <div className="modal__content-button-wrapper">
                            <Button
                                type="button"
                                color="red-text"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Close Window
                            </Button>
                        </div>
                    </div>
                </Modal.Content>
            </Modal>
        </section>
    );
};

export default SectionStripeProducts;

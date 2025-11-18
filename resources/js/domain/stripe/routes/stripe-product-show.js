/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router';
import { NavLink } from 'react-router-dom';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/**
 * Internal dependencies
 */
import BaseLayout from '@app/components/base-layout/base-layout';
import Page from '@app/components/page/page';
import Logo from '@/images/logo@2x.png';
import Info from '@/images/info.png';
import SupportImg from '@/images/support.png';
import PadLockImg from '@/images/padlock.png';
import Loader from '@app/components/loader/loader';
import initializeGTM from '@app/lib/initialize-gtm';
import FormStripeRegisterAccount from '@app/domain/stripe/components/form-stripe-register-account/form-stripe-register-account';
import FormStripeBilling from '@app/domain/stripe/components/form-stripe-billing/form-stripe-billing';
import useStripeProductShowQuery from '@app/data/stripe/use-stripe-product-show-query';
import usePagesSettingsShowQuery from '@app/data/settings/use-pages-settings-show-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const StripeProductShow = () => {
    const navigate = useNavigate();
    const { stripeProductSlug } = useParams();
    const { pathname } = useLocation();
    const isRegisterPage = pathname.includes('register');
    const queryParams = new URLSearchParams(location.search);
    const subscriptionType = queryParams.get('subscription-type');

    const { authUser, isUserLoggedIn } = usePermissionsContextApi();
    const {
        setIsPopupNotificationVisible,
        setPopupNotificationText,
        setPopupNotificationColor,
    } = usePopupNotificationContext();

    const { isLoading: isStripeProductQueryLoading, data: stripeProduct } =
        useStripeProductShowQuery(stripeProductSlug);
    const { isLoading: arePagesSettingsLoading, data: pagesSettings } =
        usePagesSettingsShowQuery();

    useEffect(() => {
        initializeGTM();

        if (authUser?.is_super_admin) {
            return navigate('/account');
        }

        if (isUserLoggedIn && authUser?.has_plan && !authUser?.plan?.is_free) {
            setIsPopupNotificationVisible(true);
            setPopupNotificationColor('red');
            setPopupNotificationText(
                "You're currently on an active plan. If you wish to switch to another plan, you can do so by clicking the 'Edit/Upgrade Plan' button."
            );

            return navigate('/account');
        }
    }, []);

    if (isStripeProductQueryLoading || arePagesSettingsLoading) {
        return <Loader white fixed />;
    }

    return (
        <BaseLayout hideSidebar hideFooter>
            <Page modifier="stripe-product" color="white">
                <section className="section">
                    <div className="section__header">
                        <div className="section__header__row">
                            <img src={Info} alt="Info" />
                            <p>
                                {isRegisterPage
                                    ? 'That looks like a great plan! To get started, create your PathPro Account below:'
                                    : 'You’ve successfully created your PathPro account! Please submit your billing info below to continue:'}
                            </p>
                        </div>
                        <div className="section__header__row">
                            <img src={Logo} alt="Logo" />
                            <NavLink to={pagesSettings.pricing_page_url}>
                                Back to Pricing & Plans
                            </NavLink>
                            <span className="section__header-divider" />
                            {isRegisterPage ? (
                                <>
                                    <strong>
                                        1. Create Your PathPro Account
                                    </strong>
                                    <span>
                                        {stripeProduct.is_free
                                            ? '2. Get Started!'
                                            : '2. Complete Purchase'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>1. Create Your PathPro Account</span>
                                    <strong>2. Complete Purchase</strong>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="section__body">
                        <div className="section__left">
                            <div className="section__row has-border">
                                <h2>Selected Plan:</h2>
                            </div>
                            <div className="section__row">
                                <h2>{stripeProduct.name}</h2>
                            </div>
                            <div className="section__row">
                                {subscriptionType === 'monthly' ||
                                stripeProduct.is_free ? (
                                    <h1>
                                        <strong>
                                            ${stripeProduct.monthly_price}
                                        </strong>{' '}
                                        USD / mo.
                                    </h1>
                                ) : (
                                    <>
                                        <h1>
                                            <span>
                                                ${stripeProduct.monthly_price}
                                            </span>
                                            <strong>
                                                $
                                                {
                                                    stripeProduct.discounted_monthly_price
                                                }
                                            </strong>{' '}
                                            USD / mo.
                                        </h1>
                                        <h6>
                                            {
                                                stripeProduct.yearly_discount_percentage
                                            }
                                            % Savings!
                                        </h6>
                                    </>
                                )}
                            </div>
                            <div className="section__row">
                                {parse(
                                    DOMPurify.sanitize(
                                        stripeProduct.description
                                    )
                                )}
                            </div>
                            <div className="section__row">
                                <h3>
                                    INCLUDED IN {stripeProduct.name}{' '}
                                    {stripeProduct.name === 'FREE'
                                        ? 'PLAN:'
                                        : ':'}
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
                                        stripeProduct.is_unlimited) && (
                                        <li>
                                            {stripeProduct.team_members_count}{' '}
                                            Team Members
                                        </li>
                                    )}
                                    <li>{stripeProduct.tech_support_type}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="section__right">
                            <Routes>
                                <Route
                                    path="/register"
                                    element={
                                        isUserLoggedIn ? (
                                            <Navigate
                                                to={`/stripe-purchase-product/${stripeProduct.slug}/billing?subscription-type=${subscriptionType}`}
                                            />
                                        ) : (
                                            <FormStripeRegisterAccount />
                                        )
                                    }
                                />
                                <Route
                                    path="/billing"
                                    element={
                                        stripeProduct.is_free ? (
                                            <Navigate to="/dashboard" />
                                        ) : (
                                            <FormStripeBilling
                                                stripeProduct={stripeProduct}
                                                pagesSettings={pagesSettings}
                                            />
                                        )
                                    }
                                />
                            </Routes>
                        </div>
                    </div>
                    <div className="section__footer">
                        <div className="section__footer-group section__footer-group--padlock">
                            <img src={PadLockImg} alt="padlock" />
                            <p>
                                <b>Your Data is Safe:</b> PathPro utilizes the
                                latest tech in data encryption and privacy
                                protection.
                            </p>
                        </div>
                        <div className="section__footer-group">
                            <img src={SupportImg} alt="support" />
                            <p>
                                <b>Dedicated Support:</b> Questions or issues?
                                Our US-based support team is here to help!
                            </p>
                        </div>
                    </div>
                </section>
            </Page>
        </BaseLayout>
    );
};

export default StripeProductShow;

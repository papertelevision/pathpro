/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import Button from '@app/components/button/button';
import FormCheckbox from '@app/components/form/form-checkbox';
import Loader from '@app/components/loader/loader';
import StripeBadgeImg from '@/images/stripe-trust-badge.png';
import useStripeProductPurchaseMutation from '@app/data/stripe/use-stripe-product-purchase-mutation';

const defaultValues = {
    billable_name: '',
    billable_address: '',
};

const schema = yup.object().shape({
    billable_name: yup.string().required('This field is required.'),
    billable_address: yup.string().required('This field is required.'),
    terms_of_purchase: yup.bool().oneOf([true], 'This field must be checked.'),
});

const FormStripeBilling = ({ stripeProduct, pagesSettings }) => {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const subscriptionType = queryParams.get('subscription-type');

    const stripe = useStripe();
    const elements = useElements();

    const { mutate: mutateStripeProductPurchase } =
        useStripeProductPurchaseMutation(stripeProduct.slug);

    const [isLoaderVisible, setIsLoaderVisible] = useState(false);

    const methods = useForm({
        defaultValues: defaultValues,
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = async (values) => {
        if (!stripe || !elements) {
            alert('Failed to load Stripe.js.');
        }

        const cardElement = elements.getElement(CardElement);

        setIsLoaderVisible(true);

        await stripe
            .createToken(cardElement)
            .then(async (createTokenResult) => {
                if (!createTokenResult.error) {
                    const { error: createPaymentMethodError, paymentMethod } =
                        await stripe.createPaymentMethod({
                            type: 'card',
                            card: cardElement,
                        });

                    if (!createPaymentMethodError) {
                        mutateStripeProductPurchase(
                            {
                                ...values,
                                is_monthly_subscription:
                                    subscriptionType === 'monthly',
                                payment_method: paymentMethod,
                            },
                            {
                                onSuccess: () => navigate('/dashboard'),
                                onError: () => setIsLoaderVisible(false),
                            }
                        );
                    } else {
                        alert(createPaymentMethodError);
                        setIsLoaderVisible(false);
                    }
                } else {
                    alert(createTokenResult.error.message);
                    setIsLoaderVisible(false);
                }
            });
    };

    useEffect(() => {
        if (!stripe || !elements) {
            return;
        }
    }, [stripe, elements]);

    return (
        <FormProvider {...methods}>
            <Form
                modifier="billing"
                onSubmit={methods.handleSubmit(handleFormSubmit)}
            >
                <div className="form__inner borderless">
                    <div className="form__header">
                        <h2>Billing Info</h2>
                        <div className="form__header-box">
                            {subscriptionType === 'monthly'
                                ? `You will be charged $${stripeProduct.monthly_price} USD / mo.`
                                : `You will be charged $${stripeProduct.yearly_price} USD / yr.`}
                        </div>
                    </div>
                    <Form.Content>
                        <FormField
                            id="coupon"
                            name="coupon"
                            placeholder="Promo Code? Enter it here!"
                        />
                        <FormField
                            id="billable_name"
                            name="billable_name"
                            placeholder="Billing Name"
                        />
                        <FormField
                            id="billable_address"
                            name="billable_address"
                            placeholder="Billing Address"
                        />
                        <div className="form__default">
                            <div className="form__field">
                                <CardElement
                                    id="card-element"
                                    className="form__stripe-element"
                                />
                            </div>
                        </div>
                        <FormCheckbox
                            id="terms_of_purchase"
                            name="terms_of_purchase"
                            description={
                                <>
                                    I agree to PathPro's{' '}
                                    <NavLink
                                        to={
                                            pagesSettings.terms_of_purchase_page_url
                                        }
                                    >
                                        Terms of Purchase
                                    </NavLink>
                                </>
                            }
                            modifier="colored"
                        />
                    </Form.Content>
                    <Form.Footer unbordered>
                        <Button
                            type="submit"
                            modifier="rectangular"
                            disabled={isLoaderVisible}
                        >
                            Complete Purchase
                        </Button>
                        {isLoaderVisible && <Loader />}
                    </Form.Footer>

                    <img
                        src={StripeBadgeImg}
                        alt="stripe-badge"
                        className="form__stripe-badge"
                    />
                </div>
            </Form>
        </FormProvider>
    );
};

export default FormStripeBilling;

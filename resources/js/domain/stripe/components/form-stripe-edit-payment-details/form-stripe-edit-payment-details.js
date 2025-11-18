/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import Button from '@app/components/button/button';
import FormField from '@app/components/form/form-field';
import Loader from '@app/components/loader/loader';
import useStripeCustomerUpdateMutation from '@app/data/stripe/use-stripe-customer-update-mutation';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const defaultValues = {
    billable_name: '',
    billable_address: '',
};

const schema = yup.object().shape({
    billable_name: yup.string().required('This field is required.'),
    billable_address: yup.string().required('This field is required.'),
    terms_of_purchase: yup.bool().oneOf([true], 'This field must be checked.'),
});

const FormStripeEditPaymentDetails = ({ setIsModalOpen }) => {
    const stripe = useStripe();
    const elements = useElements();

    const { selectedValue: projectSlug } = useHeaderSelectContext();
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();

    const {
        mutate: mutateUpdateStripeCustomer,
        isLoading: isStripeCustomerMutationLoading,
    } = useStripeCustomerUpdateMutation(projectSlug);

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
                        mutateUpdateStripeCustomer(
                            {
                                ...values,
                                payment_method: paymentMethod,
                            },
                            {
                                onSuccess: () => {
                                    setPopupNotificationText(
                                        'You have successfully updated your payment details!'
                                    );
                                    setIsPopupNotificationVisible(true);
                                    setIsModalOpen(false);
                                },
                            }
                        );
                    } else {
                        alert(createPaymentMethodError);
                    }
                } else {
                    alert(createTokenResult.error.message);
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
                className="has-min-width"
                modifier="billing"
                onSubmit={(e) => {
                    e.stopPropagation();
                    return methods.handleSubmit(handleFormSubmit)(e);
                }}
            >
                <div className="form__inner form__inner--edit-billing borderless">
                    <div className="form__header form__header--edit-billing">
                        <h2>Edit Payment Details</h2>
                    </div>
                    <Form.Content modifier="edit-billing">
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
                    </Form.Content>
                    <Form.Footer modifier="edit-billing" unbordered>
                        {isStripeCustomerMutationLoading ? (
                            <Loader white smaller />
                        ) : (
                            <>
                                <Button type="submit" modifier="rectangular">
                                    Update Payment Info
                                </Button>
                                <Button
                                    type="button"
                                    color="red-text"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Close Window
                                </Button>
                            </>
                        )}
                    </Form.Footer>
                </div>
            </Form>
        </FormProvider>
    );
};

export default FormStripeEditPaymentDetails;

/**
 * External dependencies
 */
import React, { useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import Button from '@app/components/button/button';
import ButtonSocialite from '@app/domain/auth/login/components/button-socialite/button-socialite';
import Loader from '@app/components/loader/loader';
import useStripeProductRegisterMutation from '@app/data/stripe/use-stripe-product-register-mutation';

const defaultValues = {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
};

const schema = yup.object().shape({
    username: yup.string().required('Username is required.'),
    email: yup.string().email().required('Email is required.'),
    password: yup.string().required('Password is required'),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const FormStripeRegisterAccount = () => {
    const navigate = useNavigate();
    const { stripeProductSlug } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const subscriptionType = queryParams.get('subscription-type');

    const { mutate: mutateStripeProductRegister } =
        useStripeProductRegisterMutation(stripeProductSlug);

    const [isLoaderVisible, setIsLoaderVisible] = useState(false);

    const methods = useForm({
        defaultValues: defaultValues,
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) => {
        setIsLoaderVisible(true);
        mutateStripeProductRegister(
            {
                ...values,
                is_monthly_subscription: subscriptionType === 'monthly',
            },
            {
                onSuccess: () => {
                    localStorage.clear();
                    window.isLoggedIn = true;
                    navigate(
                        `/stripe-purchase-product/${stripeProductSlug}/billing?subscription-type=${subscriptionType}`
                    );
                },
                onError: (error) => {
                    const {
                        response: { data },
                    } = error;
                    Object.keys(data.errors).map((field) => {
                        methods.setError(field, {
                            message: data.errors[field][0],
                        });
                    });
                    setIsLoaderVisible(false);
                },
            }
        );
    };

    return (
        <FormProvider {...methods}>
            <Form
                modifier="authenticate"
                onSubmit={methods.handleSubmit(handleFormSubmit)}
            >
                <div className="form__inner borderless">
                    <div className="form__header">
                        <h2>Create Your PathPro Account</h2>
                        <strong>
                            Already Have a PathPro Account?{' '}
                            <NavLink
                                to={`/login?stripe-product=${stripeProductSlug}&subscription-type=${subscriptionType}`}
                            >
                                Log in here
                            </NavLink>
                        </strong>
                    </div>
                    <Form.Content>
                        <FormField
                            id="username"
                            name="username"
                            title="Username"
                        />
                        <FormField
                            id="email"
                            name="email"
                            type="email"
                            title="Email"
                        />
                        <FormField
                            id="password"
                            name="password"
                            type="password"
                            title="Password"
                        />
                        <FormField
                            id="repeatPassword"
                            name="password_confirmation"
                            type="password"
                            title="Repeat your password"
                        />
                    </Form.Content>
                    <Form.Footer className="justify-center" unbordered>
                        {isLoaderVisible ? (
                            <Loader />
                        ) : (
                            <>
                                <Button
                                    type="submit"
                                    rounded
                                    medium
                                    color="blue"
                                >
                                    Register
                                </Button>
                                <ButtonSocialite
                                    type="google"
                                    redirectTo={stripeProductSlug}
                                    action={subscriptionType}
                                />
                                <ButtonSocialite
                                    type="facebook"
                                    redirectTo={stripeProductSlug}
                                    action={subscriptionType}
                                />
                            </>
                        )}
                    </Form.Footer>
                </div>
            </Form>
        </FormProvider>
    );
};

export default FormStripeRegisterAccount;

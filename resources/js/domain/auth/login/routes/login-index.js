/**
 * External dependencies
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Logo from '@/images/logo@2x.png';
import Form from '@app/components/form/form';
import Button from '@app/components/button/button';
import Appsumo from '@/images/appsumo.png';
import FormField from '@app/components/form/form-field';
import BaseLayout from '@app/components/base-layout/base-layout';
import useLoginMutation from '@app/data/auth/login/use-login-mutation';
import ButtonSocialite from '@app/domain/auth/login/components/button-socialite/button-socialite';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';

const schema = yup.object().shape({
    email: yup.string().email().required('Email is required.'),
    password: yup.string().required('Password is required'),
});

const LoginIndex = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stripeProduct = queryParams.get('stripe-product');
    const subscriptionType = queryParams.get('subscription-type');
    const appSumoCode = queryParams.get('code');
    const { selectedValue } = useHeaderSelectContext();
    const { mutate: mutateUseLogin } = useLoginMutation(selectedValue);

    const methods = useForm({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        mutateUseLogin(
            {
                ...values,
                stripeProduct: stripeProduct,
                isMonthlySubscription: subscriptionType === 'monthly',
                code: appSumoCode,
            },
            {
                onError: (error) => {
                    const {
                        status,
                        response: { data },
                    } = error;

                    // validation errors
                    if (status === 422) {
                        Object.keys(data.errors).map((field) => {
                            methods.setError(field, {
                                message: data.errors[field][0],
                            });
                        });
                    } else {
                        alert(data.message);
                    }
                },
            }
        );

    return (
        <BaseLayout modifier="centered" hideFooter>
            <FormProvider {...methods}>
                <Form
                    modifier="authenticate"
                    onSubmit={methods.handleSubmit(handleFormSubmit)}
                >
                    <div className="form__inner">
                        {appSumoCode && (
                            <div className="form__intro">
                                <img src={Logo} alt="App Logo" />
                                <span>with</span>
                                <img src={Appsumo} alt="AppSumo Logo" />
                            </div>
                        )}
                        <div className="form__header">
                            <center>
                                <h2>Log in</h2>
                            </center>
                        </div>
                        <Form.Content>
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
                        </Form.Content>
                        <Form.Footer className="justify-center" unbordered>
                            <Button type="submit" rounded medium color="blue">
                                Login
                            </Button>
                            <NavLink
                                to="/forgot-password"
                                end
                                className="login_nav-link"
                            >
                                Forgot password?
                            </NavLink>
                            <ButtonSocialite
                                type="google"
                                redirectTo={stripeProduct}
                                action={stripeProduct && subscriptionType}
                            />
                            <ButtonSocialite
                                type="facebook"
                                redirectTo={stripeProduct}
                                action={stripeProduct && subscriptionType}
                            />
                        </Form.Footer>
                    </div>
                </Form>
            </FormProvider>
        </BaseLayout>
    );
};

export default LoginIndex;

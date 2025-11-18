/**
 * External dependencies
 */
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';

/**
 * Internal dependencies
 */
import Logo from '@/images/logo@2x.png';
import Appsumo from '@/images/appsumo.png';
import Form from '@app/components/form/form';
import Button from '@app/components/button/button';
import FormField from '@app/components/form/form-field';
import BaseLayout from '@app/components/base-layout/base-layout';
import ButtonSocialite from '@app/domain/auth/login/components/button-socialite/button-socialite';
import { axiosInstance } from '@app/lib/axios';

const schema = yup.object().shape({
    username: yup.string().required('Username is required.'),
    email: yup.string().email().required('Email is required.'),
    password: yup.string().required('Password is required'),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const Register = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [disableForm, setDisableForm] = useState(false);

    const methods = useForm({
        defaultValues: {
            code: searchParams.get('code'),
            email: '',
            username: '',
            password: '',
            password_confirmation: '',
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) => {
        if (disableForm) return;

        setDisableForm(true);

        axiosInstance
            .post('/register', values)
            .then(() => {
                localStorage.clear();
                window.isLoggedIn = true;
                navigate('/dashboard');
            })
            .catch((error) => {
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

                setDisableForm(false);
            });
    };

    useEffect(() => {
        const error = searchParams.get('error');

        if (error) {
            searchParams.delete('error');
            alert(error);
        }
    }, []);

    return (
        <BaseLayout modifier="centered" hideSidebar hideFooter>
            <FormProvider {...methods}>
                <Form
                    modifier="authenticate"
                    onSubmit={methods.handleSubmit(handleFormSubmit)}
                >
                    <div className="form__inner">
                        <div className="form__intro">
                            <img src={Logo} alt="App Logo" />
                            <span>with</span>
                            <img src={Appsumo} alt="AppSumo Logo" />
                        </div>
                        <div className="form__header">
                            <h2>Register</h2>
                            <strong>
                                Already Have a PathPro Account?
                                <NavLink
                                    to={`/login?code=${searchParams.get(
                                        'code'
                                    )}`}
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
                            <Button type="submit" rounded medium color="blue">
                                Register
                            </Button>
                            <ButtonSocialite
                                type="google"
                                action="appsumo"
                                disabled={disableForm}
                                redirectTo="/dashboard"
                            />
                            <ButtonSocialite
                                type="facebook"
                                action="appsumo"
                                disabled={disableForm}
                                redirectTo="/dashboard"
                            />
                        </Form.Footer>
                    </div>
                </Form>
            </FormProvider>
        </BaseLayout>
    );
};

export default Register;

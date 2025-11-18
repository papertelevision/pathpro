/**
 * External dependencies
 */
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation } from 'react-router';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import Button from '@app/components/button/button';
import useProjectCommunityMemberRegisterMutation from '@app/data/auth/register/use-project-community-member-register-mutation';
import BaseLayout from '@app/components/base-layout/base-layout';
import ButtonSocialite from '@app/domain/auth/login/components/button-socialite/button-socialite';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

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

const FormCommunityMemberRegister = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { mutate: mutateRegister } =
        useProjectCommunityMemberRegisterMutation();

    const methods = useForm({
        mode: 'all',
        defaultValues: defaultValues,
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        mutateRegister(values, {
            onSuccess: () =>
                navigate(location.state?.redirectTo || `/${projectSlug}`),
            onError: (error) => {
                const {
                    response: { data },
                } = error;
                Object.keys(data.errors).map((field) => {
                    methods.setError(field, { message: data.errors[field][0] });
                });
            },
        });

    return (
        <BaseLayout modifier="centered" hideFooter>
            <FormProvider {...methods}>
                <Form
                    modifier="authenticate"
                    onSubmit={methods.handleSubmit(handleFormSubmit)}
                >
                    <div className="form__inner">
                        <div className="form__header">
                            <h2>Register</h2>
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
                                redirectTo={`/${projectSlug}`}
                            />
                            <ButtonSocialite
                                type="facebook"
                                redirectTo={`/${projectSlug}`}
                            />
                        </Form.Footer>
                    </div>
                </Form>
            </FormProvider>
        </BaseLayout>
    );
};

export default FormCommunityMemberRegister;

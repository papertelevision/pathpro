/**
 * External dependencies
 */
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { parse } from 'qs';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import Button from '@app/components/button/button';
import BaseLayout from '@app/components/base-layout/base-layout';
import ButtonSocialite from '@app/domain/auth/login/components/button-socialite/button-socialite';
import useTeamMemberInvitationDestroyMutation from '@app/data/team-member-invitation/use-team-member-invitation-destroy-mutation';

const schema = yup.object().shape({
    username: yup.string().required('Username is required.'),
    email: yup.string().email().required('Email is required.'),
    password: yup.string().required('Password is required'),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const FormTeamMemberRegister = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { invitation, email, token } = parse(location.search, {
        ignoreQueryPrefix: true,
    });

    const { mutate: mutateDestroyInvitation } =
        useTeamMemberInvitationDestroyMutation(invitation);

    const methods = useForm({
        defaultValues: {
            username: '',
            email: email,
            token: token,
            password: '',
            password_confirmation: '',
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        mutateDestroyInvitation(values, {
            onSuccess: () => {
                localStorage.clear();
                window.isLoggedIn = true;
                navigate('/projects');
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
                                readOnly
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
                            <ButtonSocialite type="google" />
                            <ButtonSocialite type="facebook" />
                        </Form.Footer>
                    </div>
                </Form>
            </FormProvider>
        </BaseLayout>
    );
};

export default FormTeamMemberRegister;

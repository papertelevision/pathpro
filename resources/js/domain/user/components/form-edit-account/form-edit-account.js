/**
 * External dependencies
 */
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import AuthUserStats from '@app/domain/user/components/auth-user-stats/auth-user-stats';
import AuthUserPlanDetails from '@app/domain/user/components/auth-user-plan-details/auth-user-plan-details';
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormTextArea from '@app/components/form/form-textarea';
import Button from '@app/components/button/button';
import InputUploadFile from '@app/components/input-upload-file/input-upload-file';
import useAuthenticatedUserUpdateMutation from '@app/data/user/use-authenticated-user-update-mutation';
import useUserAvatarUpdateMutation from '@app/data/user/use-user-avatar-update-mutation';
import usePasswordResetMutation from '@app/data/password-reset/use-password-reset-mutation';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const schema = yup.object().shape({
    username: yup.string().required('This field is required.'),
    email: yup.string().email().required('This field is required.'),
});

const FormEditAccount = () => {
    const [userAvatar, setUserAvatar] = useState(null);
    const {
        setIsPopupNotificationVisible,
        setPopupNotificationText,
        setPopupNotificationColor,
    } = usePopupNotificationContext();
    const { selectedValue: projectSlug } = useHeaderSelectContext();
    const {
        authUser,
        canUpdateProject,
        isAuthUserAssignToProject,
        isAuthUserCommunityMember,
        isAuthUserAdmitOrTeamMember,
    } = usePermissionsContextApi();

    const { mutate: mutateAuthenticatedUserUpdate } =
        useAuthenticatedUserUpdateMutation(projectSlug);
    const { mutate: mutateUserAvatarUpdate } = useUserAvatarUpdateMutation(
        authUser.id,
        projectSlug
    );
    const { mutate: mutatePasswordReset } = usePasswordResetMutation();

    const methods = useForm({
        defaultValues: {
            avatar: authUser.avatar,
            username: authUser.username,
            email: authUser.email,
            biography: authUser.biography,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const callUserAvatarUpdateMutation = () => {
        const fileData = new FormData();
        fileData.append('avatar', userAvatar);

        mutateUserAvatarUpdate(fileData, {
            onSuccess: () => {
                handleMutationOnSuccess();
            },
        });
    };

    const handleFormSubmit = (values) => {
        mutateAuthenticatedUserUpdate(values, {
            onSuccess: () => handleMutationOnSuccess(),
        });

        if (userAvatar) {
            callUserAvatarUpdateMutation();
        }
    };

    const handleMutationOnSuccess = () => {
        setPopupNotificationText('Account information updated !');
        setIsPopupNotificationVisible(true);
    };

    const handleClickButtonSendResetPasswordLink = (e) => {
        e.preventDefault();
        mutatePasswordReset(
            { email: authUser.email },
            {
                onSuccess: () => {
                    setPopupNotificationText(
                        'Password reset link send successfully!'
                    );
                    setIsPopupNotificationVisible(true);
                },
                onError: () => {
                    setPopupNotificationText(
                        'Failed to send password reset link!'
                    );
                    setPopupNotificationColor('red');
                    setIsPopupNotificationVisible(true);
                },
            }
        );
    };

    return (
        <FormProvider {...methods}>
            <Form
                onSubmit={methods.handleSubmit(handleFormSubmit)}
                noValidate
                modifier="member"
            >
                <div className="user-row user-row--account">
                    <div className="user-row-col-left">
                        <div className="user-row-content">
                            <Form.Content>
                                <FormField
                                    title="Username"
                                    id="username"
                                    name="username"
                                />
                                <FormField
                                    title="Email"
                                    id="email"
                                    name="email"
                                    type="email"
                                />
                                <InputUploadFile
                                    title="Profile Photo"
                                    name="avatar"
                                    uploadedFile={authUser.avatar}
                                    setUploadedFile={setUserAvatar}
                                />
                                <FormTextArea
                                    title="Your Bio"
                                    id="biography"
                                    name="biography"
                                    marginBottom
                                    mediumHeight
                                />
                            </Form.Content>
                            <Form.Footer>
                                <strong>Reset Password</strong>
                                <Button
                                    type="button"
                                    rounded
                                    color="black"
                                    mobileFull
                                    onClick={
                                        handleClickButtonSendResetPasswordLink
                                    }
                                >
                                    Send Reset Link
                                </Button>
                            </Form.Footer>
                        </div>
                    </div>
                    {!authUser.is_super_admin &&
                        authUser.has_plan &&
                        ((projectSlug &&
                            !isAuthUserCommunityMember(null, projectSlug) &&
                            (isAuthUserAssignToProject(null, projectSlug) ||
                                canUpdateProject(null, projectSlug))) ||
                            !projectSlug) && (
                            <div className="user-row-col-right">
                                <div className="user-row-content user-row-content--plan">
                                    <div className="user-row-content-header">
                                        <AuthUserPlanDetails />
                                    </div>
                                </div>
                            </div>
                        )}
                    {projectSlug &&
                        !isAuthUserAdmitOrTeamMember(null, projectSlug) && (
                            <AuthUserStats />
                        )}
                </div>
                <div className="user-row-footer">
                    <Button type="submit" rounded larger color="blue">
                        Update Profile
                    </Button>
                </div>
            </Form>
        </FormProvider>
    );
};

export default FormEditAccount;

/**
 * External dependencies
 */
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormTextArea from '@app/components/form/form-textarea';
import Button from '@app/components/button/button';
import MemberProfileStats from '@app/domain/user/components/member-profile-stats/member-profile-stats';
import InputUploadFile from '@app/components/input-upload-file/input-upload-file';
import usePasswordResetMutation from '@app/data/password-reset/use-password-reset-mutation';
import useProjectCommunityMemberUpdateMutation from '@app/data/project/use-project-community-member-update-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const FormEditCommunityMemberProfile = ({
    member,
    setOpenAlertBox,
    setOpenUnBanAlertBox,
    disabled,
}) => {
    const {
        setIsPopupNotificationVisible,
        setPopupNotificationText,
        setPopupNotificationColor,
    } = usePopupNotificationContext();
    const { projects } = useQueryContextApi();
    const { mutate: mutatePasswordReset } = usePasswordResetMutation();
    const { mutate: mutateUserUpdate } =
        useProjectCommunityMemberUpdateMutation(projectSlug, member.id);

    const methods = useForm({
        defaultValues: {
            avatar: member.avatar,
            username: member.username,
            email: member.email,
            biography: member.biography,
            rank: member.rank?.id,
            is_rank_visible: member.rank?.is_rank_visible,
        },
        mode: 'all',
    });

    const handleFormSubmit = (values) =>
        mutateUserUpdate(values, {
            onSuccess: () => {
                setPopupNotificationText('Account information updated!');
                setIsPopupNotificationVisible(true);
            },
        });

    const handleClickButtonSendResetPasswordLink = () =>
        mutatePasswordReset(
            { email: member.email },
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

    const project = projects.find((project) => project.slug === projectSlug);
    const isMemberAssignedToSelectedProject = project?.community_members.some(
        (cm) => cm.id === member.id
    );

    return (
        <FormProvider {...methods}>
            <Form
                onSubmit={methods.handleSubmit(handleFormSubmit)}
                noValidate
                modifier="member"
            >
                <div className="user-row">
                    <div className="user-row-col-left">
                        <div className="user-row-content">
                            <div className="form__header">
                                <strong>User Account Details</strong>
                                <i>
                                    *Note that all info below can only be edited
                                    by the member.
                                </i>
                            </div>
                            <Form.Content>
                                <FormField
                                    id="username"
                                    name="username"
                                    readOnly
                                >
                                    Username
                                </FormField>
                                <FormField
                                    title="Email"
                                    id="email"
                                    name="email"
                                    type="email"
                                    readOnly
                                />
                                <InputUploadFile
                                    title="Profile Photo"
                                    name="avatar"
                                    uploadedFile={member.avatar}
                                    user={member}
                                    disabled
                                />
                                <FormTextArea
                                    title="User Bio"
                                    id="biography"
                                    name="biography"
                                    readOnly
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
                    <div className="user-row-col-right">
                        <MemberProfileStats
                            isCommunityMember
                            member={member}
                            setOpenAlertBox={setOpenAlertBox}
                            setOpenUnBanAlertBox={setOpenUnBanAlertBox}
                            disabled={disabled}
                        />
                    </div>
                </div>
                <div className="user-row-footer">
                    {projectSlug && isMemberAssignedToSelectedProject && (
                        <Button
                            type="submit"
                            rounded
                            larger
                            color="blue"
                            disabled={disabled}
                        >
                            Update User Settings
                        </Button>
                    )}
                </div>
            </Form>
        </FormProvider>
    );
};

export default FormEditCommunityMemberProfile;

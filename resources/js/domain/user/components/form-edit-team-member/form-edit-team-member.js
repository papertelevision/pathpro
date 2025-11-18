/**
 * External dependencies
 */
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormTextArea from '@app/components/form/form-textarea';
import Button from '@app/components/button/button';
import MemberProfileStats from '@app/domain/user/components/member-profile-stats/member-profile-stats';
import TeamMemberProfilePermissions from '@app/domain/user/components/team-member-profile-permissions/team-member-profile-permissions';
import InputUploadFile from '@app/components/input-upload-file/input-upload-file';
import usePasswordResetMutation from '@app/data/password-reset/use-password-reset-mutation';
import useProjectTeamMemberUpdateMutation from '@app/data/project/use-project-team-member-update-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const FormEditTeamMember = ({
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
    const { userId } = useParams();
    const { projects } = useQueryContextApi();

    const { mutate: mutatePasswordReset } = usePasswordResetMutation();
    const { mutate: mutateTeamMemberUpdate } =
        useProjectTeamMemberUpdateMutation(projectSlug, userId);

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

    const handleFormSubmit = (values) => {
        values.permissions = values?.permission
            ?.map((permissions, projectId) => ({
                project_id: projectId,
                permission: permissions,
            }))
            .filter((p) => p);

        mutateTeamMemberUpdate(values, {
            onSuccess: () => {
                setPopupNotificationText('Account information updated!');
                setIsPopupNotificationVisible(true);
            },
        });
    };

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
    const isMemberAssignedToSelectedProject = project?.team_members.some(
        (cm) => cm.id === member.id
    );
    const isMemberBannedFromSelectedProject = project?.banned_team_members.some(
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
                                    disabled
                                />
                                <FormTextArea
                                    title="User Bio"
                                    id="biography"
                                    name="biography"
                                    mediumHeight
                                    readOnly
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
                        {!isMemberBannedFromSelectedProject &&
                            isMemberAssignedToSelectedProject && (
                                <TeamMemberProfilePermissions
                                    userData={member}
                                />
                            )}
                        <MemberProfileStats
                            isCommunityMember={false}
                            member={member}
                            setOpenAlertBox={setOpenAlertBox}
                            setOpenUnBanAlertBox={setOpenUnBanAlertBox}
                            disabled={disabled}
                        />
                    </div>
                </div>
                <div className="user-row-footer" style={{ marginBottom: '30px' }}>
                    <Button
                        type="submit"
                        rounded
                        larger
                        color="blue"
                        disabled={disabled}
                    >
                        Update User Settings
                    </Button>
                </div>
            </Form>
        </FormProvider>
    );
};

export default FormEditTeamMember;

/**
 * External dependencies
 */
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormTextArea from '@app/components/form/form-textarea';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormToggle from '@app/components/form/form-toggle';
import FormSelect from '@app/components/form/form-select';
import FormModalInviteTeamMember from '@app/domain/team-member-invitation/components/form-modal-invite-team-member/form-modal-invite-team-member';
import Button from '@app/components/button/button';
import ButtonIcon from '@app/components/button/button-icon';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import AlertBox from '@app/components/alert-box/alert-box';
import useUnassignedUsersIndexQuery from '@app/data/user/use-unassigned-users-index-query';
import useProjectUpdateMutation from '@app/data/project/use-project-update-mutation';
import useProjectDestroyMutation from '@app/data/project/use-project-destroy-mutation';
import useProjectTeamMemberDestroyMutation from '@app/data/project/use-project-team-member-destroy-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useSubdomain } from '@app/lib/domain';

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    description: yup.string().required('This field is required.'),
});

const FormEditProject = ({
    project,
    closeModal,
    setIsFormChanged,
    setIsModalOpen,
}) => {
    const navigate = useNavigate();
    const [banMember, setBanMember] = useState(false);
    const [deletingMemberId, setDeletingMemberId] = useState();
    const [wipeMemberContent, setWipeMemberContent] = useState(false);
    const [openAlertBoxDeleteMember, setOpenAlertBoxDeleteMember] =
        useState(false);
    const [openAlertBoxForDeleteAction, setOpenAlertBoxForDeleteAction] =
        useState(false);

    const { setSelectedValue: setSelectedHeaderProjectSlug } =
        useHeaderSelectContext();
    const { canAssignTeamMembers } = usePermissionsContextApi();
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();
    const {
        selectedValue: selectedProjectSlug,
        setSelectedValue: setProjectSlug,
    } = useHeaderSelectContext();
    const { projectVisibilities: visibilities } = useQueryContextApi();

    const { isLoading: isUsersDataLoading, data: usersData } =
        useUnassignedUsersIndexQuery(project.slug);
    const { mutate: mutateProjectsUpdate } = useProjectUpdateMutation(
        project.slug
    );
    const { mutate: mutateUserDestroy } = useProjectTeamMemberDestroyMutation(
        project.slug,
        deletingMemberId
    );
    const { mutate: mutateProjectsDestroy } = useProjectDestroyMutation(
        project.slug
    );

    const methods = useForm({
        defaultValues: {
            title: project.title,
            visibility: project.visibility,
            description: project.description,
            team_members: project.team_members.map((item) => ({
                value: item.id,
                avatar: item.avatar,
                label: item.username,
                entireItem: item,
            })),
            is_description_public: project.is_description_public,
            is_public_upvoting_allowed: project.is_public_upvoting_allowed,
            are_feature_submissions_allowed:
                project.are_feature_submissions_allowed,
            date_format: project.date_format,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) => {
        mutateProjectsUpdate(
            {
                ...values,
                team_members: values.team_members.map((item) => item.value),
            },
            {
                onSuccess: (response) => {
                    setIsModalOpen(false);
                    setSelectedHeaderProjectSlug(response.data);
                    window.location.href = useSubdomain(
                        response.data,
                        'projects'
                    );
                },
            }
        );
    };

    const handleClickCancelButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        closeModal();
    };

    const handleOpenAlertBoxDeleteMember = (e) => {
        setDeletingMemberId(e.currentTarget.name);
        setOpenAlertBoxDeleteMember(true);
    };

    const handleDeleteTeamMember = () => {
        mutateUserDestroy(
            { wipe_member_content: wipeMemberContent, ban_member: banMember },
            {
                onSuccess: () => {
                    setOpenAlertBoxDeleteMember(false);
                    setPopupNotificationText(
                        'The user has been unassigned as a team member from the project!'
                    );
                    setIsPopupNotificationVisible(true);
                },
            }
        );
    };

    const handleMutateDestroyProject = () => {
        mutateProjectsDestroy(project.id, {
            onSuccess: () => {
                project.slug === selectedProjectSlug && setProjectSlug();
                setOpenAlertBoxForDeleteAction(false);
                navigate('/projects');
            },
        });
    };

    useEffect(() => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        return () => setIsFormChanged(false);
    }, [methods.formState]);

    useEffect(() => {
        methods.setValue(
            'team_members',
            project.team_members.map((item) => ({
                value: item.id,
                avatar: item.avatar,
                label: item.username,
                entireItem: item,
            })),
            { shouldDirty: false }
        );
    }, [project.team_members]);

    if (isUsersDataLoading) {
        return null;
    }

    return (
        <Fragment>
            <FormProvider {...methods}>
                <Form
                    onSubmit={methods.handleSubmit(handleFormSubmit)}
                    modifier="project"
                    noValidate
                >
                    <Form.Content>
                        <Form.ColLeft>
                            <div className="form__col-head">
                                <h3>Edit Product / Project / Goal</h3>
                            </div>
                            <FormField
                                title="Title"
                                id="title"
                                name="title"
                                readOnly={project.is_custom_domain_configured}
                            />
                            <FormTextArea
                                title="Description"
                                id="description"
                                name="description"
                                placeholder="Describe your product, project, or major goal here. This can include the overall goals, the intended “end results” or simply a description of your product."
                            />
                            <FormToggle
                                id="is_description_public"
                                name="is_description_public"
                                description="Make Description Public"
                                marginBottom
                            />
                            <FormSelect
                                title="Visibility"
                                id="visibility"
                                name="visibility"
                                selected={project.visibility}
                                data={visibilities}
                                marginBottom
                            />
                            <MultipleSelectField
                                title="Add or Edit Team Members / Collaborators"
                                id="team_members"
                                name="team_members"
                                placeholder="Click or start typing to add Team Member(s) to this Project"
                                data={usersData}
                                removeValueHandler={
                                    handleOpenAlertBoxDeleteMember
                                }
                                readOnly={!canAssignTeamMembers}
                            />
                            <FormModalInviteTeamMember project={project} />
                        </Form.ColLeft>
                        <Form.ColRight>
                            <span>Community Involvement Settings</span>
                            <FormToggle
                                id="are_feature_submissions_allowed"
                                name="are_feature_submissions_allowed"
                                description="Allow Feedback Submissions"
                            />
                            <FormToggle
                                id="is_public_upvoting_allowed"
                                name="is_public_upvoting_allowed"
                                description="Allow Public Voting"
                                marginBottom
                            />

                            <span>Other Settings</span>

                            <div className="form__text is-smaller">
                                Date Format
                            </div>
                            <FormToggle
                                notControlled
                                id="us"
                                name="date_format"
                                description="USA: MM-DD-YYYY"
                                onChange={() =>
                                    methods.setValue('date_format', 'us', {
                                        shouldValidate: true,
                                    })
                                }
                                checked={methods.watch('date_format') === 'us'}
                            />
                            <FormToggle
                                notControlled
                                id="uk"
                                name="date_format"
                                description="UK: DD-MM-YYYY"
                                onChange={() =>
                                    methods.setValue('date_format', 'uk', {
                                        shouldValidate: true,
                                    })
                                }
                                checked={methods.watch('date_format') === 'uk'}
                            />
                            <FormToggle
                                notControlled
                                id="other"
                                name="date_format"
                                description="Other: YYYY-MM-DD"
                                onChange={() =>
                                    methods.setValue('date_format', 'other', {
                                        shouldValidate: true,
                                    })
                                }
                                checked={
                                    methods.watch('date_format') === 'other'
                                }
                            />
                        </Form.ColRight>
                    </Form.Content>
                    <Form.Footer justify>
                        <ButtonIcon
                            iconType="trash"
                            hasBorder
                            onClick={() => setOpenAlertBoxForDeleteAction(true)}
                        />

                        <div className="form__footer-group">
                            <Button
                                type="button"
                                color="is-transparent"
                                modifier="rectangular"
                                onClick={handleClickCancelButton}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                modifier="rectangular"
                                color="is-red"
                            >
                                Save Settings
                            </Button>
                        </div>
                    </Form.Footer>
                </Form>
            </FormProvider>
            <AlertBox
                isActive={openAlertBoxForDeleteAction}
                setOpenAlertBox={setOpenAlertBoxForDeleteAction}
                deleteAction={handleMutateDestroyProject}
                message="Are you sure you want to delete this project ? This will unassign all tasks, team members, and subscribers. That's pretty serious stuff!"
            />
            <AlertBox
                modifier="remove-member"
                isActive={openAlertBoxDeleteMember}
                setOpenAlertBox={setOpenAlertBoxDeleteMember}
                deleteAction={handleDeleteTeamMember}
                message="Are you sure you want to remove this member from this project? Additionally, you may wipe all
                of their content, <br/> and/or ban them from the project altogether. Select all that apply below, or
                simply click “Confirm” to remove them from the project without removing their contributions."
                additionalActions={[
                    {
                        title: 'Wipe member content',
                        description:
                            'Select to fully remove all comments, upvotes, stats, and other details associated with this member. This cannot be undone! Note: the user can rejoin the project in the future unless you also select the “Ban Member” option below.',
                        handler: (e) => setWipeMemberContent(e.target.checked),
                    },
                    {
                        title: 'Ban member',
                        description:
                            'This option will ban this member from the project, and will prevent<br/> the user from rejoining the project unless you remove the ban.',
                        handler: (e) => setBanMember(e.target.checked),
                    },
                ]}
            />
        </Fragment>
    );
};

export default FormEditProject;

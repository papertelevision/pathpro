/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormTextArea from '@app/components/form/form-textarea';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormToggle from '@app/components/form/form-toggle';
import FormSelect from '@app/components/form/form-select';
import FormModalInviteTeamMember from '@app/domain/team-member-invitation/components/form-modal-invite-team-member/form-modal-invite-team-member';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import useUnassignedUsersIndexQuery from '@app/data/user/use-unassigned-users-index-query';
import useProjectStoreMutation from '@app/data/project/use-project-store-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useSubdomain } from '@app/lib/domain';

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    description: yup.string().required('This field is required.'),
});

const FormAddProject = ({ closeModal, setIsFormChanged }) => {
    const {
        selectedValue: projectSlug,
        setSelectedValue: setSelectedHeaderProjectSlug,
    } = useHeaderSelectContext();
    const { mutate: mutateProjectStore } = useProjectStoreMutation(projectSlug);
    const { projectVisibilities: visibilities } = useQueryContextApi();
    const { isLoading: isUsersDataLoading, data: usersData } =
        useUnassignedUsersIndexQuery();
    const { authUser, canAssignTeamMembers } = usePermissionsContextApi();

    const methods = useForm({
        defaultValues: {
            title: '',
            visibility: visibilities[0].id,
            description: '',
            team_members: [],
            is_description_public: false,
            is_public_upvoting_allowed: false,
            are_feature_submissions_allowed: true,
            date_format: 'us',
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) => {
        mutateProjectStore(
            {
                ...values,
                team_members: values.team_members.map((item) => item.value),
            },
            {
                onSuccess: (response) => {
                    setSelectedHeaderProjectSlug(response.data.slug);

                    window.location.href = useSubdomain(
                        response.data.slug,
                        'projects',
                        '?newly-created-project=true'
                    );
                },
            }
        );
    };

    const handleClickCancelButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        closeModal();
    };

    useEffect(() => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        return () => setIsFormChanged(false);
    }, [methods.formState]);

    if (isUsersDataLoading) {
        return null;
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={methods.handleSubmit(handleFormSubmit)} modifier="project" noValidate>
                <Form.Content>
                    <Form.ColLeft>
                        <div className="form__col-head">
                            <h3>Add New Project / Product / Goal</h3>
                        </div>
                        <FormField title="Title" id="title" name="title" />
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
                            selected={visibilities[0].id}
                            data={visibilities}
                            marginBottom
                        />
                        {canAssignTeamMembers ? (
                            authUser.projects_count > 0 ? (
                                <>
                                    <MultipleSelectField
                                        title="Add or Edit Team Members / Collaborators"
                                        id="team_members"
                                        name="team_members"
                                        placeholder="Click or start typing to add Team Member(s) to this Project"
                                        data={usersData}
                                        marginType="has-no-margin"
                                    />
                                    <div className="form__text">
                                        <i>
                                            <b>Note:</b> The above list includes
                                            Team Members and Community members
                                            who belong to other Projects on your
                                            account. To invite <b>new</b> Team
                                            Members to this Project, you'll need
                                            to first add/save this Project.
                                        </i>
                                    </div>
                                </>
                            ) : (
                                <div className="form__text">
                                    <h5>
                                        Add or Edit Team Members / Collaborators
                                    </h5>
                                    <div className="form__text-box">
                                        <i>
                                            <b>Note:</b> In order to invite Team
                                            Members, you must create your first
                                            Project — which you’re doing right
                                            now! After doing so, you may then
                                            return here, or visit the “Team
                                            Members” section of admin to invite
                                            new Team Members / Collaborators.
                                        </i>
                                    </div>
                                </div>
                            )
                        ) : (
                            <FormModalInviteTeamMember />
                        )}
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

                        <div className="form__text is-smaller">Date Format</div>
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
                            checked={methods.watch('date_format') === 'other'}
                        />
                    </Form.ColRight>
                </Form.Content>
                <Form.Footer justify>
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
                            Add Project / Goal
                        </Button>
                    </div>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormAddProject;

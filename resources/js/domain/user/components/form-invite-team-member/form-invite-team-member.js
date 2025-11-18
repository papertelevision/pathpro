/**
 * External dependencies
 */
import React, { Fragment, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import Button from '@app/components/button/button';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import useTeamMemberInvitationStoreMutation from '@app/data/team-member-invitation/use-team-member-invitation-store-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schema = yup.object().shape({
    email: yup.string().email().required('This field is required.'),
    projects: yup
        .array()
        .min(1, 'At least 1 project must be selected.')
        .required('This field is required.'),
});

const FormInviteTeamMember = ({
    teamMember,
    project,
    closeModal,
    setIsFormChanged,
    setIsInviteTeamMemberModalOpen,
    currentTablePage,
}) => {
    const { projects } = useQueryContextApi();
    const { canUpdateProject } = usePermissionsContextApi();

    const { mutate: mutateInviteTeamMember } =
        useTeamMemberInvitationStoreMutation(projectSlug, currentTablePage);

    const methods = useForm({
        defaultValues: {
            email: teamMember?.email || '',
            projects: project
                ? [
                      {
                          value: project.id,
                          label: project.title,
                          entireItem: project,
                      },
                  ]
                : [],
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        mutateInviteTeamMember(
            {
                ...values,
                projects: values.projects.map((project) => project.value),
            },
            {
                onSuccess: () => {
                    setIsInviteTeamMemberModalOpen(false);
                },
            }
        );

    const handleClickCancelButton = () => {
        setIsFormChanged(methods.formState.isDirty);
        closeModal();
    };

    useEffect(() => {
        setIsFormChanged(methods.formState.isDirty);
        return () => setIsFormChanged(false);
    }, [methods.formState]);

    return (
        <Fragment>
            <FormProvider {...methods}>
                <Form
                    modifier="invite-team-member"
                    onSubmit={(e) => {
                        e.stopPropagation();
                        return methods.handleSubmit(handleFormSubmit)(e);
                    }}
                >
                    <Form.Content>
                        <Form.ColLeft maxWidth>
                            <div className="form__col-head" style={{ paddingTop: '8px', paddingBottom: '18px', borderBottom: '1px solid #e1e1e1', marginBottom: '28px' }}>
                                <h3>Invite Team Member</h3>
                            </div>
                            <FormField
                                title="Email"
                                id="email"
                                name="email"
                                readOnly={teamMember?.email}
                            />
                            <MultipleSelectField
                                title="Select Projects"
                                id="projects"
                                name="projects"
                                placeholder="Start typing to select projects for team member..."
                                data={projects.filter((project) =>
                                    canUpdateProject(project.id)
                                )}
                                higherPadding
                                maxMenuHeight={90}
                                menuPlacement="bottom"
                            />
                        </Form.ColLeft>
                    </Form.Content>

                    <Form.Footer justify>
                        <Button
                            type="button"
                            color="blue-text"
                            onClick={handleClickCancelButton}
                        >
                            Cancel
                        </Button>
                        <div className="form__footer-group">
                            <Button
                                type="submit"
                                modifier="rectangular"
                                color="is-red"
                            >
                                Invite Team Member
                            </Button>
                        </div>
                    </Form.Footer>
                </Form>
            </FormProvider>
        </Fragment>
    );
};

export default FormInviteTeamMember;

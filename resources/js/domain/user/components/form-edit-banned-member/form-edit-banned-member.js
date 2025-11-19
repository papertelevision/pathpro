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
import ButtonDeny from '@app/components/button/button-deny';
import InputUploadFile from '@app/components/input-upload-file/input-upload-file';
import Icon from '@app/components/icon/icon';
import { useQueryContextApi } from '@app/lib/query-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const FormEditBannedMember = ({ member, setOpenAlertBox, disabled }) => {
    const { projects } = useQueryContextApi();

    const project = projects.find((project) => project.slug === projectSlug);
    const isMemberBanned = projectSlug
        ? project?.banned_community_members.some((cm) => cm.id === member.id) ||
          project?.banned_team_members.some((tm) => tm.id === member.id)
        : projects.some(
              (p) =>
                  p?.banned_community_members?.some(
                      (cm) => cm.id === member.id
                  ) || p?.banned_team_members?.some((tm) => tm.id === member.id)
          );

    const methods = useForm({
        defaultValues: {
            avatar: member.avatar,
            username: member.username,
            email: member.email,
            biography: member.biography,
        },
        mode: 'all',
    });

    return (
        <FormProvider {...methods}>
            <Form
                onSubmit={methods.handleSubmit()}
                noValidate
                modifier="member"
            >
                <div className="user-row">
                    <div className="user-row-col-left">
                        <div className="user-row-content">
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
                                    marginBottom
                                    mediumHeight
                                    readOnly
                                />
                            </Form.Content>
                        </div>
                    </div>
                    <div className="user-row-col-right">
                        <div className="user-row-content">
                            {!isMemberBanned && (
                                <div className="user-row-content-header">
                                    <h3 className="user-row-content-header__title">
                                        {projectSlug
                                            ? 'This user is not banned from this project!'
                                            : 'This user is not banned from any project!'}
                                    </h3>
                                </div>
                            )}
                            {isMemberBanned && (
                                <ul className="user-row-content__list">
                                    <li className="user-row-content__list-actions">
                                        {projectSlug && (
                                            <ButtonDeny
                                                block
                                                type="button"
                                                color="green"
                                                onClick={() =>
                                                    setOpenAlertBox(true)
                                                }
                                                disabled={disabled}
                                            >
                                                <Icon type="check_mark" />
                                                Admit Access to This Project
                                            </ButtonDeny>
                                        )}
                                        {!projectSlug && (
                                            <ButtonDeny
                                                block
                                                type="button"
                                                color="green"
                                                onClick={() =>
                                                    setOpenAlertBox(true)
                                                }
                                                disabled={disabled}
                                            >
                                                <Icon type="check_mark" />
                                                Admit Access to All Your
                                                Projects
                                            </ButtonDeny>
                                        )}
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </Form>
        </FormProvider>
    );
};

export default FormEditBannedMember;

/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { debounce, startCase } from 'lodash';
import { parse } from 'qs';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';
import FormRow from '@app/components/form/form-row';
import Button from '@app/components/button/button';
import ButtonDeny from '@app/components/button/button-deny';
import Form from '@app/components/form/form';
import FormRowBox from '@app/components/form/form-row-box';
import FormSelect from '@app/components/form/form-select';
import useSubmissionUpdateMutation from '@app/data/submission/use-submission-update-mutation';
import useAdoptedSubmissionStoreMutation from '@app/data/submission/use-adopted-submission-store-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';
import { dateFormat } from '@app/lib/date-format';

const FormAdoptSubmission = ({ submission, project }) => {
    const [adoptTo, setAdoptTo] = useState(false);
    const [removeOpacity, setRemoveOpacity] = useState(
        false || submission.is_adopted
    );
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();
    const {
        canCreateEditTasksFeatures,
        canAdoptSubmissions,
        canUpdateProject,
    } = usePermissionsContextApi();

    const location = useLocation();
    const queryArgs = parse(location.search, { ignoreQueryPrefix: true });

    const { mutate: mutateSubmissionUpdate } = useSubmissionUpdateMutation(
        submission.id,
        project.slug,
        queryArgs
    );

    const { mutate: mutateAdoptedSubmissionStore } =
        useAdoptedSubmissionStoreMutation(
            project.slug,
            submission.id,
            queryArgs
        );

    const schema = yup.object().shape({
        task_group_id:
            adoptTo && yup.mixed().required('This field is required.'),
    });

    const methods = useForm({
        defaultValues: {
            title: submission.title,
            description: submission.description,
            is_highlighted: submission.is_highlighted,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const onSuccess = () => {
        setPopupNotificationText('Submission updated!');
        setIsPopupNotificationVisible(true);
    };

    const handleAdoptToSelect = (value) => {
        setAdoptTo(value === 'roadmap');
        setRemoveOpacity(true);
    };

    const handleConfirmAdoption = (values) =>
        mutateAdoptedSubmissionStore(values, {
            onSuccess: () => onSuccess(),
        });

    const handleDenySubmission = (values) => {
        values.status = 'denied';
        values.is_highlighted = false;
        mutateSubmissionUpdate(values, {
            onSuccess: () => onSuccess(),
        });
    };

    const handleHighlightSubmission = (values) => {
        values.status = null;
        values.is_highlighted = !submission.is_highlighted;
        mutateSubmissionUpdate(values, {
            onSuccess: () => onSuccess(),
        });
    };

    useEffect(() => {
        methods.reset(submission);
    }, [submission]);

    return (
        <FormProvider {...methods}>
            <Form
                noValidate
                className={submission.is_adopted ? 'pointer-events-hover' : ''}
                modifier="adopt-submission"
            >
                <div className="form__header">
                    <h4>OPTIONS</h4>
                    <Icon
                        type="question"
                        data-tooltip-id="tooltip"
                        data-tooltip-float
                        data-tooltip-variant="light"
                        data-tooltip-place="top"
                        data-tooltip-attr="adopt-submission"
                        data-tooltip-class-name="react-tooltip--adopt-submission"
                    />
                </div>
                <Form.Content>
                    {canCreateEditTasksFeatures(project.id) &&
                        !submission.is_adopted && (
                            <FormRow>
                                <FormRowBox opacityUnset>
                                    <button
                                        className={
                                            submission.is_highlighted
                                                ? 'has-green-border'
                                                : ''
                                        }
                                        type="button"
                                        onClick={debounce(
                                            methods.handleSubmit(
                                                handleHighlightSubmission
                                            ),
                                            500
                                        )}
                                    >
                                        <Icon type="highlight" />
                                        {submission.is_highlighted
                                            ? 'Highlighted For Later Reference'
                                            : 'Highlight For Later Reference'}
                                    </button>
                                </FormRowBox>
                            </FormRow>
                        )}
                    {canAdoptSubmissions(project.id) && (
                        <>
                            {!submission.is_adopted && (
                                <>
                                    <FormRow>
                                        <FormRowBox>
                                            <strong>
                                                ADOPT THIS SUBMISSION?
                                            </strong>
                                        </FormRowBox>
                                    </FormRow>
                                    <FormRow>
                                        <FormSelect
                                            title="Adopt To"
                                            id="adopt_to"
                                            name="adopt_to"
                                            placeholder="Please Select..."
                                            data={[
                                                {
                                                    id: 'roadmap',
                                                    title: 'Roadmap',
                                                },
                                                {
                                                    id: 'voting',
                                                    title: 'Feature Voting',
                                                },
                                            ]}
                                            onValueUpdate={handleAdoptToSelect}
                                        />
                                        <FormSelect
                                            title="Task Group"
                                            id="task_group_id"
                                            name="task_group_id"
                                            placeholder="Please Select..."
                                            data={project.task_groups}
                                            invisible={!adoptTo}
                                        />
                                    </FormRow>
                                </>
                            )}
                            <FormRow>
                                <Button
                                    type="button"
                                    rounded
                                    larger
                                    color="blue"
                                    hasOpacity={!removeOpacity}
                                    mobileFull="mobile-full"
                                    onClick={methods.handleSubmit(
                                        handleConfirmAdoption
                                    )}
                                >
                                    <Icon type="check_mark" />
                                    {submission.is_adopted
                                        ? `Adopted on ${dateFormat(
                                              submission.updated_at,
                                              project.date_format,
                                              false,
                                              true
                                          )} to ${startCase(submission.status)}`
                                        : 'Confirm Adoption'}
                                </Button>
                            </FormRow>
                        </>
                    )}
                </Form.Content>
                {canUpdateProject(project.id) &&
                    !submission.is_adopted &&
                    !submission.is_denied && (
                        <Form.Footer>
                            <ButtonDeny
                                block
                                type="submit"
                                onClick={methods.handleSubmit(
                                    handleDenySubmission
                                )}
                            >
                                <Icon type="deny" />
                                Deny Submission
                            </ButtonDeny>
                        </Form.Footer>
                    )}
            </Form>
        </FormProvider>
    );
};

export default FormAdoptSubmission;

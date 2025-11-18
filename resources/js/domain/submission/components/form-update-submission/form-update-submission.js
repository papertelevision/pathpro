/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { parse } from 'qs';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import Button from '@app/components/button/button';
import FormField from '@app/components/form/form-field';
import TableSubmissionShow from '@app/domain/submission/components/table-submissions/table-submission-show';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import useSubmissionUpdateMutation from '@app/data/submission/use-submission-update-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
});

const FormUpdateSubmission = ({ submission, project }) => {
    const { canCreateEditTasksFeatures } = usePermissionsContextApi();
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();

    const location = useLocation();
    const queryArgs = parse(location.search, { ignoreQueryPrefix: true });

    const { mutate: mutateSubmissionUpdate } = useSubmissionUpdateMutation(
        submission.id,
        project.slug,
        queryArgs
    );

    const methods = useForm({
        defaultValues: {
            title: submission.title,
            description: submission.description,
            is_highlighted: submission.is_highlighted,
            status: submission.status,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        mutateSubmissionUpdate(values, {
            onSuccess: () => {
                setPopupNotificationText('Submission updated!');
                setIsPopupNotificationVisible(true);
            },
        });

    useEffect(() => {
        methods.reset(submission);
    }, [submission]);

    return (
        <FormProvider {...methods}>
            <Form
                onSubmit={methods.handleSubmit(handleFormSubmit)}
                noValidate
                modifier="table"
            >
                <TableSubmissionShow
                    project={project}
                    submission={submission}
                />
                <FormField
                    title="Title"
                    id="title"
                    name="title"
                    defaultValue={submission.title}
                    readOnly={
                        submission.is_adopted ||
                        submission.is_denied ||
                        !canCreateEditTasksFeatures(project.id)
                    }
                />
                <RichTextEditor
                    id="edit"
                    label="Description"
                    name="description"
                    modifier="table"
                    readOnly={
                        submission.is_adopted ||
                        submission.is_denied ||
                        !canCreateEditTasksFeatures(project.id)
                    }
                />
                {!(
                    submission.is_adopted ||
                    submission.is_denied ||
                    !canCreateEditTasksFeatures(project.id)
                ) && (
                    <Form.Footer>
                        <Button
                            type="submit"
                            rounded
                            larger
                            color="black"
                            mobileFull
                        >
                            Update Submission
                        </Button>
                    </Form.Footer>
                )}
            </Form>
        </FormProvider>
    );
};

export default FormUpdateSubmission;

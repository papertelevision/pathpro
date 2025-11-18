/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLocation } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { parse } from 'qs';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormSelect from '@app/components/form/form-select';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import useProjectSubmissionStoreMutation from '@app/data/project/use-project-submission-store-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    description: yup.mixed().required('This field is required.'),
    project_id: yup.string().required('This field is required.'),
});

const FormAddSubmission = ({
    closeModal,
    setIsFormChanged,
    setIsAddSubmissionModalOpen,
    currentTablePage = 1,
}) => {
    const { projects } = useQueryContextApi();
    const { canUpdateProject } = usePermissionsContextApi();
    const location = useLocation();
    const queryArgs = parse(location.search, { ignoreQueryPrefix: true });

    const { mutate: mutateSubmissionStore } = useProjectSubmissionStoreMutation(
        projectSlug,
        currentTablePage,
        queryArgs
    );

    const methods = useForm({
        defaultValues: {
            title: '',
            description: '',
            project_id: '',
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) =>
        mutateSubmissionStore(values, {
            onSuccess: () => {
                setIsAddSubmissionModalOpen(false);
            },
        });

    const handleClickCancelButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        closeModal();
    };

    useEffect(() => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        return () => setIsFormChanged(false);
    }, [methods.formState]);

    return (
        <FormProvider {...methods}>
            <Form onSubmit={methods.handleSubmit(handleFormSubmit)} modifier="submission" noValidate>
                <Form.Content>
                    <Form.ColLeft maxWidth>
                        <div className="form__col-head" style={{ paddingTop: '8px', paddingBottom: '18px', borderBottom: '1px solid #e1e1e1', marginBottom: '28px' }}>
                            <h3>Add New Submission</h3>
                        </div>
                        <FormField title="Title" id="title" name="title" />
                        <FormSelect
                            title="Project"
                            id="project_id"
                            name="project_id"
                            data={projects.filter((project) =>
                                canUpdateProject(project.id)
                            )}
                            selected={
                                projects.find(
                                    (project) => project.slug === projectSlug
                                )?.id
                            }
                            marginBottom
                        />
                        <RichTextEditor
                            id="add"
                            label="Description"
                            name="description"
                            larger
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
                            Create Submission
                        </Button>
                    </div>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormAddSubmission;

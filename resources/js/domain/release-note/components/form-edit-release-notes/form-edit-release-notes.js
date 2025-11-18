/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import qs from 'qs';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import FormField from '@app/components/form/form-field';
import MultiReactSelect from '@app/components/multi-react-select/multi-react-select';
import Button from '@app/components/button/button';
import Loader from '@app/components/loader/loader';
import useProjectCompletedTasksIndexQuery from '@app/data/project/use-project-completed-tasks-index-query';
import useReleaseNoteUpdateMutation from '@app/data/release-note/use-release-note-update-mutation';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    description: yup.mixed().required('This field is required.'),
});

const FormEditReleaseNotes = ({
    releaseNote,
    currentTablePage,
    closeModal,
    setIsFormChanged,
    setIsEditReleaseNoteModalOpen,
}) => {
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const {
        data: ProjectCompletedTasksData,
        isLoading: isProjectCompletedTasksDataLoading,
    } = useProjectCompletedTasksIndexQuery(projectSlug);
    const { mutate: mutateReleaseNoteUpdate } = useReleaseNoteUpdateMutation(
        releaseNote.id,
        projectSlug,
        currentTablePage,
        queryArgs
    );

    const methods = useForm({
        defaultValues: {
            title: releaseNote.title,
            description: releaseNote.description,
            status: releaseNote.status,
            project_id: releaseNote.project_id,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const formatReleaseNotesData = (data, status) => {
        data.status = status === 'Published' ? 'Published' : 'Draft';
        data.tasks = data.tasks
            ? data.tasks.map((item) => ({
                  id: item.value,
              }))
            : [];

        return data;
    };

    const handleFormSubmit = (values) => {
        mutateReleaseNoteUpdate(formatReleaseNotesData(values, 'Published'), {
            onSuccess: () => {
                setIsEditReleaseNoteModalOpen(false);
            },
        });
    };

    const handleClickSaveAsDraft = (values) => {
        mutateReleaseNoteUpdate(formatReleaseNotesData(values, 'Draft'), {
            onSuccess: () => {
                setIsEditReleaseNoteModalOpen(false);
            },
        });
    };

    const handleClickCancelButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        closeModal();
    };

    useEffect(() => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        return () => setIsFormChanged(false);
    }, [methods.formState]);

    if (isProjectCompletedTasksDataLoading) {
        return <Loader white />;
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={methods.handleSubmit(handleFormSubmit)} noValidate>
                <Form.Content>
                    <Form.ColLeft maxWidth>
                        <FormField title="Title" id="title" name="title" />
                        <RichTextEditor
                            label="Description"
                            name="description"
                            larger
                        />
                        <div className="form__inline-elements">
                            <MultiReactSelect
                                title="Include Completed Tasks in this Release:"
                                id="tasks"
                                name="tasks"
                                placeholder="Start typing to find completed task(s)..."
                                data={ProjectCompletedTasksData}
                                selectedValues={releaseNote.completed_tasks}
                                medium
                            />
                        </div>
                    </Form.ColLeft>
                </Form.Content>
                <Form.Footer className="mobile-block">
                    <div className="form-footer__col">
                        <Button
                            type="button"
                            color="close"
                            onClick={handleClickCancelButton}
                        >
                            Cancel
                        </Button>
                        <i className="form-footer__divider"></i>
                        <Button
                            type="button"
                            color="blue-text"
                            onClick={methods.handleSubmit(
                                handleClickSaveAsDraft
                            )}
                        >
                            Save As Draft
                        </Button>
                    </div>
                    <div className="form-footer__col">
                        <Button type="submit" rounded medium color="blue">
                            Publish Release Notes
                        </Button>
                    </div>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormEditReleaseNotes;

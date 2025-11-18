/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLocation } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import qs from 'qs';
import Cookies from 'js-cookie';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormRow from '@app/components/form/form-row';
import FormField from '@app/components/form/form-field';
import FormSelect from '@app/components/form/form-select';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormToggle from '@app/components/form/form-toggle';
import Button from '@app/components/button/button';
import FormColorPicker from '@app/components/form/form-color-picker';
import FormIconPicker from '@app/components/form/form-icon-picker';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import DatePicker from '@app/components/date-picker/date-picker';
import useTaskGroupStoreMutation from '@app/data/task-group/use-task-group-store-mutation';
import useTaskGroupIconStoreMutation from '@app/data/task-group/use-task-group-icon-store-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
});

const FormAddTaskGroup = ({
    project,
    closeModal,
    setIsFormChanged,
    handleFormState = () => {},
    setIsAddTaskGroupModalOpen,
}) => {
    const [displayColor, setDisplayColor] = useState('#3376a3');
    const [taskGroupIcon, setTaskGroupIcon] = useState(null);
    const [predefinedIconId, setPredefinedIconId] = useState(null);

    const { taskGroupVisibilities: visibilities } = useQueryContextApi();
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { mutate: mutateTaskGroupStore } = useTaskGroupStoreMutation(
        projectSlug,
        queryArgs
    );
    const { mutate: mutateTaskGroupIconStore } = useTaskGroupIconStoreMutation(
        projectSlug,
        queryArgs
    );

    const methods = useForm({
        defaultValues: {
            title: '',
            description: '',
            header_color: displayColor,
            planned_release_type: 'Single Date',
            planned_release_start_date: new Date(),
            planned_release_end_date: new Date(),
            is_planned_release_date_include: true,
            icon: '',
            visibility: visibilities[0].id,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const callTaskGroupIconStoreMutation = (taskGroupId) => {
        const fileData = new FormData();
        fileData.append('icon', taskGroupIcon);
        fileData.append('task_group_id', taskGroupId);

        mutateTaskGroupIconStore(fileData, {
            onSuccess: () => {
                Cookies.remove('openModal');
                handleFormState((formIndex) => formIndex + 1);
                setIsAddTaskGroupModalOpen(false);
            },
        });
    };

    const handleFormSubmit = (values) => {
        // Add predefined icon data to the form values
        const updatedValues = {
            ...values,
            icon_type: predefinedIconId ? 'predefined' : (taskGroupIcon ? 'uploaded' : null),
            icon_identifier: predefinedIconId || null,
        };

        mutateTaskGroupStore(updatedValues, {
            onSuccess: (response) => {
                if (taskGroupIcon) {
                    callTaskGroupIconStoreMutation(response.data.data.id);
                } else {
                    Cookies.remove('openModal');
                    handleFormState((formIndex) => formIndex + 1);
                    setIsAddTaskGroupModalOpen(false);
                }
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

    return (
        <FormProvider {...methods}>
            <Form
                onSubmit={methods.handleSubmit(handleFormSubmit)}
                modifier="task-group"
                encType="multipart/form-data"
            >
                <Form.Content>
                    <Form.ColLeft maxWidth>
                        <div className="form__col-head">
                            <h3>Add Task Group</h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="task-group-close-btn"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <FormField title="Title" id="title" name="title" />
                        <RichTextEditor
                            id="description"
                            name="description"
                            label="Description"
                            modifier="medium"
                        />
                        <FormToggle
                            id="is_planned_release_date_include"
                            name="is_planned_release_date_include"
                            description="Include Release Date"
                            marginBottom
                        />
                        {methods.getValues(
                            'is_planned_release_date_include'
                        ) && (
                            <>
                                <FormSelect
                                    title="Planned Release"
                                    id="planned_release_type"
                                    name="planned_release_type"
                                    selected={'Single Date'}
                                    data={[
                                        {
                                            id: 'Single Date',
                                            title: 'Single Date',
                                        },
                                        {
                                            id: 'Date Range',
                                            title: 'Date Range',
                                        },
                                    ]}
                                    fewMarginBottom
                                />
                                <DatePicker
                                    id="planned_release_start_date"
                                    dateFormat={project.date_format}
                                    endDateName="planned_release_end_date"
                                    startDateName="planned_release_start_date"
                                    selectsRange={
                                        methods.watch(
                                            'planned_release_type'
                                        ) === 'Date Range'
                                    }
                                />
                            </>
                        )}
                        <FormColorPicker
                            name="header_color"
                            displayColor={displayColor}
                            setDisplayColor={setDisplayColor}
                        />
                        <FormIconPicker
                            name="icon"
                            setIcon={setTaskGroupIcon}
                            predefinedIconId={predefinedIconId}
                            onPredefinedIconChange={setPredefinedIconId}
                        />
                        <FormSelect
                            title="Visibility"
                            id="visibility"
                            name="visibility"
                            selected={visibilities[0].id}
                            data={visibilities}
                            marginBottom
                        />

                        <FormToggle
                            id="is_percentage_complete_visible"
                            name="is_percentage_complete_visible"
                            title="Percentage Complete"
                            description="Display Percentage Complete"
                            defaultChecked={true}
                        />
                        <FormRow marginTop marginBottom>
                            <i>
                                When selected, percentage of completion (based
                                on tasks marked as complete) will be displayed.
                            </i>
                        </FormRow>
                    </Form.ColLeft>
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
                            Create Task Group
                        </Button>
                    </div>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};

export default FormAddTaskGroup;

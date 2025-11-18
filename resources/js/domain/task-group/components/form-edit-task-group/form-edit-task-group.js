/**
 * External dependencies
 */
import React, { Fragment, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import moment from 'moment';
import { useLocation } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import qs from 'qs';
import confetti from 'canvas-confetti';

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
import ButtonIcon from '@app/components/button/button-icon';
import FormColorPicker from '@app/components/form/form-color-picker';
import FormIconPicker from '@app/components/form/form-icon-picker';
import DatePicker from '@app/components/date-picker/date-picker';
import AlertBox from '@app/components/alert-box/alert-box';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import Icon from '@app/components/icon/icon';
import useTaskGroupUpdateMutation from '@app/data/task-group/use-task-group-update-mutation';
import useTaskGroupIconUpdateMutation from '@app/data/task-group/use-task-group-icon-update-mutation';
import useTaskGroupDestroyMutation from '@app/data/task-group/use-task-group-destroy-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { postData } from '@app/lib/post-data';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
});

const FormEditTaskGroup = ({
    project,
    taskGroup,
    statuses,
    closeModal,
    setIsFormChanged,
    setIsEditTaskGroupModalOpen,
}) => {
    const [displayColor, setDisplayColor] = useState(taskGroup.header_color);
    const [openAlertBoxForDeleteAction, setOpenAlertBoxForDeleteAction] =
        useState(false);
    const [openAlertBoxForMarkAllComplete, setOpenAlertBoxForMarkAllComplete] =
        useState(false);
    const [taskGroupIcon, setTaskGroupIcon] = useState(null);
    const [predefinedIconId, setPredefinedIconId] = useState(taskGroup.icon_type === 'predefined' ? taskGroup.icon_identifier : null);
    const [isMarkingTasksComplete, setIsMarkingTasksComplete] = useState(false);

    const { taskGroupVisibilities: visibilities } = useQueryContextApi();
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { mutate: mutateTaskGroupsUpdate } = useTaskGroupUpdateMutation(
        taskGroup.id,
        projectSlug,
        queryArgs
    );
    const { mutate: mutateTaskGroupIconUpdate } =
        useTaskGroupIconUpdateMutation(taskGroup.id);
    const { mutate: mutateTaskGroupDestroy } = useTaskGroupDestroyMutation(
        projectSlug,
        queryArgs
    );

    const methods = useForm({
        defaultValues: {
            title: taskGroup.title,
            description: taskGroup.description,
            is_planned_release_date_include:
                taskGroup.is_planned_release_date_include,
            planned_release_type: taskGroup.planned_release_type,
            planned_release_start_date: moment(
                taskGroup.planned_release_start_date
            ).toDate(),
            planned_release_end_date: moment(
                taskGroup.planned_release_end_date
            ).toDate(),
            header_color: displayColor,
            visibility: taskGroup.visibility,
            mark_all_tasks_complete: false,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const callTaskGroupIconUpdateMutation = () => {
        const fileData = new FormData();
        fileData.append('icon', taskGroupIcon);
        mutateTaskGroupIconUpdate(fileData);
    };

    const handleFormSubmit = (values) => {
        // Check if user wants to mark all tasks complete
        if (values.mark_all_tasks_complete && taskGroup.tasks?.length > 0) {
            setOpenAlertBoxForMarkAllComplete(true);
            return;
        }

        // Add predefined icon data to the form values
        const updatedValues = {
            ...values,
            icon_type: predefinedIconId ? 'predefined' : (taskGroupIcon ? 'uploaded' : taskGroup.icon_type),
            icon_identifier: predefinedIconId || null,
        };

        taskGroupIcon && callTaskGroupIconUpdateMutation();
        mutateTaskGroupsUpdate(updatedValues, {
            onSuccess: () => setIsEditTaskGroupModalOpen(false),
        });
    };

    const handleClickCancelButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);

        closeModal();
    };

    const handleMutateDestroyTaskGroup = () => {
        mutateTaskGroupDestroy(taskGroup.id, {
            onSuccess: () => {
                setOpenAlertBoxForDeleteAction(false);
                setIsEditTaskGroupModalOpen(false);
            },
        });
    };

    const handleMarkAllTasksComplete = async () => {
        setIsMarkingTasksComplete(true);
        setOpenAlertBoxForMarkAllComplete(false);

        try {
            // Debug: Log the statuses array
            console.log('statuses:', statuses);
            console.log('statuses titles:', statuses?.map(s => s.title));

            // Find the "Complete" status ID
            const completeStatus = statuses?.find(
                status => status.title === 'Complete'
            );

            console.log('completeStatus found:', completeStatus);

            if (!completeStatus) {
                alert('Could not find Complete status');
                setIsMarkingTasksComplete(false);
                return;
            }

            // Update all tasks to complete status
            const updatePromises = taskGroup.tasks.map(task =>
                postData(`/api/tasks/${task.id}`, {
                    title: task.title,
                    description: task.description,
                    task_group_id: task.task_group_id,
                    task_type_id: task.task_type.id,
                    task_status_id: completeStatus.id,
                    visibility: task.visibility,
                    are_subtasks_allowed: task.are_subtasks_allowed,
                    are_stats_public: task.are_stats_public,
                    is_task_upvoting_enabled: task.is_task_upvoting_enabled,
                    are_comments_enabled: task.are_comments_enabled,
                    is_comment_upvoting_allowed: task.is_comment_upvoting_allowed,
                    are_team_members_visible: task.are_team_members_visible,
                    is_creator_visible: task.is_creator_visible,
                    team_members: task.team_members?.map(member => member.id) || [],
                    community_members: task.community_members?.map(member => member.id) || []
                })
            );

            await Promise.all(updatePromises);

            // Trigger confetti celebration!
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Update the task group (without the mark_all_tasks_complete flag)
            const values = methods.getValues();
            delete values.mark_all_tasks_complete;

            // Add predefined icon data to the form values
            const updatedValues = {
                ...values,
                icon_type: predefinedIconId ? 'predefined' : (taskGroupIcon ? 'uploaded' : taskGroup.icon_type),
                icon_identifier: predefinedIconId || null,
            };

            taskGroupIcon && callTaskGroupIconUpdateMutation();
            mutateTaskGroupsUpdate(updatedValues, {
                onSuccess: () => {
                    setIsMarkingTasksComplete(false);
                    setIsEditTaskGroupModalOpen(false);
                },
                onError: () => {
                    setIsMarkingTasksComplete(false);
                }
            });
        } catch (error) {
            alert('Error marking tasks complete: ' + error.message);
            setIsMarkingTasksComplete(false);
        }
    };

    useEffect(() => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        return () => setIsFormChanged(false);
    }, [methods.formState]);

    return (
        <Fragment>
            <FormProvider {...methods}>
                <Form onSubmit={methods.handleSubmit(handleFormSubmit)} modifier="task-group">
                    <Form.Content>
                        <Form.ColLeft maxWidth>
                            <div className="form__col-head">
                                <h3>Edit Task Group</h3>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="task-group-close-btn"
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            {taskGroup.tasks?.length > 0 && (
                                <div className="form-section-highlight">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FormCheckbox
                                            id="mark_all_tasks_complete"
                                            name="mark_all_tasks_complete"
                                            description="Mark all tasks complete"
                                        />
                                        <button
                                            type="button"
                                            data-tooltip-id="tooltip"
                                            data-tooltip-class-name="react-tooltip--mark-all-tasks"
                                            data-tooltip-content={`When selected, all ${taskGroup.tasks.length} task${taskGroup.tasks.length !== 1 ? 's' : ''} in this group will be marked as complete. You will be asked to confirm before proceeding.`}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '0',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Icon type="question" />
                                        </button>
                                    </div>
                                </div>
                            )}
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
                                        selected={
                                            taskGroup.planned_release_type
                                        }
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
                                iconUrl={taskGroup.icon_url}
                                iconData={taskGroup.icon_data}
                                predefinedIconId={predefinedIconId}
                                onPredefinedIconChange={setPredefinedIconId}
                            />
                            <FormSelect
                                title="Visibility"
                                id="visibility"
                                name="visibility"
                                selected={taskGroup.visibility}
                                data={visibilities}
                                marginBottom
                            />
                            <FormToggle
                                id="is_percentage_complete_visible"
                                name="is_percentage_complete_visible"
                                title="Percentage Complete"
                                description="Display Percentage Complete"
                                defaultChecked={
                                    taskGroup.is_percentage_complete_visible
                                }
                            />
                            <FormRow marginTop marginBottom>
                                <i>
                                    When selected, percentage of completion
                                    (based on tasks marked as complete) will be
                                    displayed.
                                </i>
                            </FormRow>
                        </Form.ColLeft>
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
                                Update
                            </Button>
                        </div>
                    </Form.Footer>
                </Form>
            </FormProvider>

            <AlertBox
                isActive={openAlertBoxForDeleteAction}
                setOpenAlertBox={setOpenAlertBoxForDeleteAction}
                deleteAction={handleMutateDestroyTaskGroup}
                message="Are you sure you want to delete this task group ?"
            />

            <AlertBox
                isActive={openAlertBoxForMarkAllComplete}
                setOpenAlertBox={setOpenAlertBoxForMarkAllComplete}
                deleteAction={handleMarkAllTasksComplete}
                message={`Are you sure you want to mark all ${taskGroup.tasks?.length || 0} task${taskGroup.tasks?.length !== 1 ? 's' : ''} in this group as complete?`}
                isLoading={isMarkingTasksComplete}
            />
        </Fragment>
    );
};

export default FormEditTaskGroup;

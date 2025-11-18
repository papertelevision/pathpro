/**
 * External dependencies
 */
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import qs from 'qs';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormSelect from '@app/components/form/form-select';
import FormRowBox from '@app/components/form/form-row-box';
import Button from '@app/components/button/button';
import ButtonIcon from '@app/components/button/button-icon';
import FormToggle from '@app/components/form/form-toggle';
import CommentsFilter from '@app/domain/comment/components/comments-filter/comments-filter';
import FormEditTaskSuggestions from '@app/domain/task/components/form-edit-task/form-edit-task-suggestions';
import BoxButtonUpvote from '@app/components/box/box-button-upvote';
import AddCommentSection from '@app/domain/comment/components/add-comment-section';
import AlertBox from '@app/components/alert-box/alert-box';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import FormRow from '@app/components/form/form-row';
import { formEditSubtaskValues } from '@app/domain/task/components/form-edit-subtask/form-edit-subtask-values';
import useSubtaskUpdateMutation from '@app/data/subtask/use-subtask-update-mutation';
import useSubtaskDestroyMutation from '@app/data/subtask/use-subtask-destroy-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import FormCloseBtn from '@app/components/form/form-close-btn';
import FormEditSubtaskLeftCol from '@app/domain/task/components/form-edit-subtask/form-edit-subtask-left-col';

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    task_type_id: yup.string().required('This field is required.'),
});

const FormEditSubtask = ({
    subtask,
    projectData,
    taskTypesData,
    taskStatusesData,
    taskCommentsData,
    sortCommentsBy,
    setSortCommentsBy,
    closeModal,
    setIsFormChanged,
    setIsEditSubtaskModalOpen,
}) => {
    const [openAlertBoxForDeleteAction, setOpenAlertBoxForDeleteAction] =
        useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { taskVisibilities: visibilities } = useQueryContextApi();
    const { isUserLoggedIn, canCreateEditTasksFeatures } =
        usePermissionsContextApi();
    const { mutate: mutateSubtaskUpdate } = useSubtaskUpdateMutation(
        subtask.id,
        projectData.slug,
        queryArgs
    );
    const { mutate: mutateSubtaskDestroy } = useSubtaskDestroyMutation(
        projectData.slug,
        queryArgs
    );

    const methods = useForm({
        defaultValues: formEditSubtaskValues(subtask),
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) => {
        // Check if there are file attachments
        const hasFiles = values.attachments && values.attachments.length > 0;

        let payload;
        if (hasFiles) {
            // Use FormData for file uploads
            const formData = new FormData();

            // Add all form fields
            Object.keys(values).forEach((key) => {
                if (key === 'attachments') {
                    // Add each file separately
                    values.attachments.forEach((file, index) => {
                        formData.append(`attachments[${index}]`, file);
                    });
                } else if (key === 'team_members' && Array.isArray(values.team_members)) {
                    values.team_members.forEach((member, index) => {
                        formData.append(`team_members[${index}]`, member.value);
                    });
                } else if (key === 'community_members' && Array.isArray(values.community_members)) {
                    values.community_members.forEach((member, index) => {
                        formData.append(`community_members[${index}]`, member.value);
                    });
                } else if (key !== 'team_members' && key !== 'community_members') {
                    // Handle boolean and other values properly
                    const value = values[key];
                    if (typeof value === 'boolean') {
                        formData.append(key, value ? '1' : '0');
                    } else if (value !== null && value !== undefined) {
                        formData.append(key, value);
                    }
                }
            });

            payload = formData;
        } else {
            // Use regular JSON payload
            payload = {
                ...values,
                team_members: Array.isArray(values.team_members)
                    ? values.team_members.map((item) => item.value)
                    : [],
                community_members: Array.isArray(values.community_members)
                    ? values.community_members.map((item) => item.value)
                    : [],
            };
        }

        mutateSubtaskUpdate(payload, {
            onSuccess: () => {
                setIsEditMode(false);
                // Reset form with current values as new defaults to clear dirty state
                const currentValues = methods.getValues();
                methods.reset(currentValues);
            },
        });
    };

    const handleMutateDestroyTask = () => {
        mutateSubtaskDestroy(subtask.id, {
            onSuccess: () => {
                setOpenAlertBoxForDeleteAction(false);
                setIsEditSubtaskModalOpen(false);
                navigate(`/${projectData.slug}`);
            },
        });
    };

    const handleClickCancelButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        closeModal();
    };

    const handleMarkAsComplete = (isChecked) => {
        methods.setValue('is_task_completed', isChecked, {
            shouldValidate: true,
        });
        const status = taskStatusesData.find((status) =>
            isChecked
                ? status.title === 'Complete'
                : status.title === 'Confirmed'
        );
        methods.setValue('task_status_id', status.id, { shouldValidate: true });
    };

    useEffect(() => {
        setIsFormChanged(methods.formState.isDirty);
        return () => setIsFormChanged(false);
    }, [methods.formState.isDirty]);

    useEffect(() => {
        const status = taskStatusesData.find(
            (status) =>
                status.id === parseInt(methods.getValues('task_status_id'))
        );
        methods.setValue('is_task_completed', status.title === 'Complete', {
            shouldValidate: true,
        });
    }, [methods.watch('task_status_id')]);

    return (
        <Fragment>
            <FormProvider {...methods}>
                <Form
                    onSubmit={methods.handleSubmit(handleFormSubmit)}
                    modifier="task"
                >
                    <Form.Content>
                        <FormEditSubtaskLeftCol
                            subtask={subtask}
                            types={taskTypesData}
                            statuses={taskStatusesData}
                            projectData={projectData}
                            methods={methods}
                            isEditMode={isEditMode}
                            setIsEditMode={setIsEditMode}
                            handleMarkAsComplete={handleMarkAsComplete}
                        />

                        <Form.ColRight>
                            <div className="form__col-head">
                                <h3>Discussion</h3>
                                <FormCloseBtn onClick={closeModal} />
                            </div>
                            {isEditMode ? (
                                <div className="form-boxes">
                                    <div className="form-boxes__item form-boxes__item--auto">
                                        <div className="form-boxes__row">
                                            <div className="form-boxes__col">
                                                <span>Feature / Task Upvoting</span>
                                                <FormToggle
                                                    id="is_task_upvoting_enabled"
                                                    name="is_task_upvoting_enabled"
                                                    description="Enable Upvoting"
                                                />
                                                <FormToggle
                                                    id="are_stats_public"
                                                    name="are_stats_public"
                                                    description="Display Stats"
                                                />
                                            </div>
                                            <div className="form-boxes__col">
                                                <span>Discussion</span>
                                                <FormToggle
                                                    id="are_comments_enabled"
                                                    name="are_comments_enabled"
                                                    description="Enable Comments & Suggestions"
                                                />
                                                <FormToggle
                                                    id="is_comment_upvoting_allowed"
                                                    name="is_comment_upvoting_allowed"
                                                    description="Allow Comment Upvoting"
                                                />
                                            </div>
                                        </div>
                                        {methods.watch('are_comments_enabled') && (
                                            <>
                                                <AddCommentSection
                                                    task={subtask}
                                                    project={projectData}
                                                    modelType="task"
                                                    sortCommentsBy={sortCommentsBy}
                                                    hideTitle={true}
                                                />
                                                <div className="form__feedback">
                                                    <span>
                                                        Feedback & Suggestions (
                                                        {taskCommentsData.length})
                                                    </span>
                                                    <CommentsFilter
                                                        setSortCommentsBy={
                                                            setSortCommentsBy
                                                        }
                                                        sortCommentsBy={
                                                            sortCommentsBy
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {methods.watch('are_comments_enabled') && (
                                        <div className="form-boxes__item form-boxes__item--scroll">
                                            <FormEditTaskSuggestions
                                                project={projectData}
                                                suggestions={taskCommentsData}
                                                task={subtask}
                                                sortCommentsBy={sortCommentsBy}
                                                isEditMode={isEditMode}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="form-boxes">
                                    <div className="form-boxes__item form-boxes__item--auto">
                                        {subtask.are_comments_enabled && (
                                            <>
                                                <AddCommentSection
                                                    task={subtask}
                                                    project={projectData}
                                                    modelType="task"
                                                    sortCommentsBy={sortCommentsBy}
                                                    hideTitle={true}
                                                />
                                                <div className="form__feedback">
                                                    <span>
                                                        Feedback & Suggestions (
                                                        {taskCommentsData.length})
                                                    </span>
                                                    <CommentsFilter
                                                        setSortCommentsBy={
                                                            setSortCommentsBy
                                                        }
                                                        sortCommentsBy={
                                                            sortCommentsBy
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {subtask.are_comments_enabled && (
                                        <div className="form-boxes__item form-boxes__item--scroll">
                                            <FormEditTaskSuggestions
                                                project={projectData}
                                                suggestions={taskCommentsData}
                                                task={subtask}
                                                sortCommentsBy={sortCommentsBy}
                                                isEditMode={isEditMode}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </Form.ColRight>
                    </Form.Content>
                    {isUserLoggedIn &&
                    canCreateEditTasksFeatures(projectData.id) ? (
                        <Form.Footer justify>
                            {isEditMode ? (
                                <>
                                    <ButtonIcon
                                        iconType="trash"
                                        hasBorder
                                        onClick={() =>
                                            setOpenAlertBoxForDeleteAction(true)
                                        }
                                    />

                                    <div className="form__footer-group">
                                        {methods.watch('is_task_upvoting_enabled') && (
                                            <BoxButtonUpvote
                                                project={projectData}
                                                showUpvotesCount={false}
                                                showIcon={true}
                                                upvotable={subtask}
                                                upvotableType="task"
                                                invalidateQueries={[
                                                    [`task/show`, subtask.id],
                                                    [
                                                        'projects/task-groups/index',
                                                        projectData.slug,
                                                        queryArgs,
                                                    ],
                                                    [
                                                        'project/release-notes/index',
                                                        projectData.slug,
                                                    ],
                                                ]}
                                            />
                                        )}
                                        <Button
                                            type="button"
                                            color="is-transparent"
                                            modifier="rectangular"
                                            onClick={handleClickCancelButton}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            type="submit"
                                            modifier="rectangular"
                                            color="is-red"
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div></div>

                                    <div className="form__footer-group">
                                        {subtask.is_task_upvoting_enabled && (
                                            <BoxButtonUpvote
                                                project={projectData}
                                                showUpvotesCount={false}
                                                showIcon={true}
                                                upvotable={subtask}
                                                upvotableType="task"
                                                invalidateQueries={[
                                                    [`task/show`, subtask.id],
                                                    [
                                                        'projects/task-groups/index',
                                                        projectData.slug,
                                                        queryArgs,
                                                    ],
                                                    [
                                                        'project/release-notes/index',
                                                        projectData.slug,
                                                    ],
                                                ]}
                                            />
                                        )}
                                        <Button
                                            type="button"
                                            color="is-transparent"
                                            modifier="rectangular"
                                            onClick={handleClickCancelButton}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            type="button"
                                            color="is-transparent"
                                            modifier="rectangular"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsEditMode(true);
                                            }}
                                        >
                                            Edit Settings
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form.Footer>
                    ) : (
                        <Form.Footer justify>
                            <div></div>

                            <div className="form__footer-group">
                                {subtask.is_task_upvoting_enabled && (
                                    <BoxButtonUpvote
                                        project={projectData}
                                        showUpvotesCount={false}
                                        showIcon={true}
                                        upvotable={subtask}
                                        upvotableType="task"
                                        invalidateQueries={[
                                            [`task/show`, subtask.id],
                                            [
                                                'projects/task-groups/index',
                                                projectData.slug,
                                                queryArgs,
                                            ],
                                            [
                                                'project/release-notes/index',
                                                projectData.slug,
                                            ],
                                        ]}
                                    />
                                )}
                                <Button
                                    type="button"
                                    color="is-transparent"
                                    modifier="rectangular"
                                    onClick={handleClickCancelButton}
                                >
                                    Close
                                </Button>
                            </div>
                        </Form.Footer>
                    )}
                </Form>
            </FormProvider>
            <AlertBox
                isActive={openAlertBoxForDeleteAction}
                setOpenAlertBox={setOpenAlertBoxForDeleteAction}
                deleteAction={handleMutateDestroyTask}
                message="Are you sure you want to delete this task ?"
            />
        </Fragment>
    );
};

export default FormEditSubtask;

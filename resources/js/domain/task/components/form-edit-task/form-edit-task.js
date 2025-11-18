/**
 * External dependencies
 */
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import qs from 'qs';
import confetti from 'canvas-confetti';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormToggle from '@app/components/form/form-toggle';
import Button from '@app/components/button/button';
import ButtonIcon from '@app/components/button/button-icon';
import BoxButtonUpvote from '@app/components/box/box-button-upvote';
import CommentsFilter from '@app/domain/comment/components/comments-filter/comments-filter';
import FormEditTaskSuggestions from '@app/domain/task/components/form-edit-task/form-edit-task-suggestions';
import FormEditTaskLeftCol from '@app/domain/task/components/form-edit-task/form-edit-task-left-col';
import AddCommentSection from '@app/domain/comment/components/add-comment-section';
import AlertBox from '@app/components/alert-box/alert-box';
import useTaskUpdateMutation from '@app/data/task/use-task-update-mutation';
import useTaskDestroyMutation from '@app/data/task/use-task-destroy-mutation';
import useTaskCommentsShowQuery from '@app/data/task/use-task-comments-show-query';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import FormCloseBtn from '@app/components/form/form-close-btn';

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    task_type_id: yup.string().required('This field is required.'),
    task_group_id: yup.string().required('This field is required.'),
});

const FormEditTask = ({
    task,
    projectData,
    projectTaskGroups,
    types,
    statuses,
    setSortCommentsBy,
    sortCommentsBy,
    closeModal,
    setIsFormChanged = () => {},
    setIsEditTaskModalOpen,
    taskPopularity,
    idxPopularity,
    tasksCount,
}) => {
    const [openAlertBoxForDeleteAction, setOpenAlertBoxForDeleteAction] =
        useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const { data: taskCommentsData } = useTaskCommentsShowQuery(
        sortCommentsBy,
        task.id
    );

    const { canCreateEditTasksFeatures, isUserLoggedIn } =
        usePermissionsContextApi();

    const navigate = useNavigate();
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { mutate: mutateTaskUpdate } = useTaskUpdateMutation(
        task.id,
        projectData.slug,
        queryArgs
    );
    const { mutate: mutateTaskDestroy } = useTaskDestroyMutation(
        projectData.slug,
        queryArgs
    );

    const methods = useForm({
        defaultValues: {
            is_task_completed: task.task_status.title === 'Complete',
            title: task.title,
            description: task.description,
            visibility: task.visibility,
            task_type_id: task.task_type.id,
            task_status_id: task.task_status.id,
            task_group_id: task.task_group_id,
            team_members: task.team_members.map((item) => ({
                value: item.id,
                avatar: item.avatar,
                label: item.username,
                entireItem: item,
            })),
            community_members: task.community_members.map((item) => ({
                value: item.id,
                avatar: item.avatar,
                label: item.username,
                entireItem: item,
            })),
            are_subtasks_allowed: task.are_subtasks_allowed,
            are_comments_enabled: task.are_comments_enabled,
            are_stats_public: task.are_stats_public,
            is_task_upvoting_enabled: task.is_task_upvoting_enabled,
            is_comment_upvoting_allowed: task.is_comment_upvoting_allowed,
            are_team_members_visible: task.are_team_members_visible,
            is_creator_visible: task.is_creator_visible,
            attachments: [],
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleFormSubmit = (values) => {
        // Check if task is being marked as complete
        const wasNotComplete = task.task_status.title !== 'Complete';
        const completeStatus = statuses?.find(status => status.title === 'Complete');
        const isNowComplete = completeStatus && values.task_status_id === completeStatus.id;
        const shouldTriggerConfetti = wasNotComplete && isNowComplete;

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

        mutateTaskUpdate(payload, {
            onSuccess: () => {
                // Trigger confetti if task was marked as complete
                if (shouldTriggerConfetti) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }

                setIsEditMode(false);
                // Reset form with current values as new defaults to clear dirty state
                const currentValues = methods.getValues();
                methods.reset(currentValues);
            },
        });
    };

    const handleClickCancelButton = () => {
        setIsFormChanged(Object.keys(methods.formState.dirtyFields).length > 0);
        closeModal();
    };

    const handleMutateDestroyTask = () => {
        mutateTaskDestroy(task.id, {
            onSuccess: () => {
                setOpenAlertBoxForDeleteAction(false);
                navigate('/');
            },
        });
    };

    useEffect(() => {
        setIsFormChanged(methods.formState.isDirty);
        return () => setIsFormChanged(false);
    }, [methods.formState.isDirty]);

    // Reset to default view when task changes (use a ref to track previous task)
    const prevTaskIdRef = useRef(String(task.id));
    useEffect(() => {
        const currentTaskId = String(task.id);
        console.log('Task ID check:', {
            previous: prevTaskIdRef.current,
            current: currentTaskId,
            areEqual: prevTaskIdRef.current === currentTaskId,
            willReset: prevTaskIdRef.current !== currentTaskId
        });

        if (prevTaskIdRef.current !== currentTaskId) {
            console.log('Task ID changed - resetting edit mode');
            setIsEditMode(false);
            prevTaskIdRef.current = currentTaskId;
        } else {
            console.log('Task ID same - not resetting');
        }
    }, [task.id]);

    return (
        <Fragment>
            <FormProvider {...methods}>
                <Form
                    onSubmit={methods.handleSubmit(handleFormSubmit)}
                    modifier="task"
                >
                    <Form.Content>
                        <FormEditTaskLeftCol
                            task={task}
                            projectData={projectData}
                            types={types}
                            statuses={statuses}
                            methods={methods}
                            taskPopularity={taskPopularity}
                            idxPopularity={idxPopularity}
                            tasksCount={tasksCount}
                            projectTaskGroups={projectTaskGroups}
                            isEditMode={isEditMode}
                            setIsEditMode={setIsEditMode}
                        />

                        <Form.ColRight>
                            <div className="form__col-head">
                                <h3>Discussion</h3>
                                <FormCloseBtn onClick={closeModal} />
                            </div>
                            <div className="form-boxes">
                                <div className="form-boxes__item form-boxes__item--auto">
                                    {isUserLoggedIn &&
                                        canCreateEditTasksFeatures(
                                            projectData.id
                                        ) &&
                                        isEditMode && (
                                            <div className="form-boxes__row">
                                                <div className="form-boxes__col">
                                                    <span>
                                                        Feature / Task Upvoting
                                                    </span>
                                                    <FormToggle
                                                        id="is_task_upvoting_enabled"
                                                        name="is_task_upvoting_enabled"
                                                        description="Enable Upvoting"
                                                    />
                                                    <FormToggle
                                                        id="are_stats_public"
                                                        name="are_stats_public"
                                                        description="Display Stats"
                                                        marginBottom
                                                    />
                                                </div>
                                                <div className="form-boxes__col">
                                                    <span>
                                                        Discussion Settings
                                                    </span>
                                                    <FormToggle
                                                        id="are_comments_enabled"
                                                        name="are_comments_enabled"
                                                        description="Enable Comments & Suggestions"
                                                        onChange={(e) =>
                                                            methods.setValue(
                                                                'are_comments_enabled',
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <FormToggle
                                                        id="is_comment_upvoting_allowed"
                                                        name="is_comment_upvoting_allowed"
                                                        description="Allow Comment Upvoting"
                                                        marginBottom
                                                        onChange={(e) =>
                                                            methods.setValue(
                                                                'is_comment_upvoting_allowed',
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    {methods.watch('are_comments_enabled') && (
                                        <>
                                            <AddCommentSection
                                                key={task.id}
                                                task={task}
                                                project={projectData}
                                                modelType="task"
                                                sortCommentsBy={sortCommentsBy}
                                                hideTitle={true}
                                            />
                                            <div className="form__feedback">
                                                <span>
                                                    Feedback & Suggestions (
                                                    {task.comments_count})
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

                                {methods.getValues('are_comments_enabled') &&
                                    taskCommentsData && (
                                        <div className="form-boxes__item form-boxes__item--scroll">
                                            <FormEditTaskSuggestions
                                                project={projectData}
                                                suggestions={taskCommentsData}
                                                task={task}
                                                sortCommentsBy={sortCommentsBy}
                                                isEditMode={isEditMode}
                                            />
                                        </div>
                                    )}
                            </div>
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
                                                upvotable={task}
                                                upvotableType="task"
                                                invalidateQueries={[
                                                    [`task/show`, task.id],
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
                                        {task.is_task_upvoting_enabled && (
                                            <BoxButtonUpvote
                                                project={projectData}
                                                showUpvotesCount={false}
                                                showIcon={true}
                                                upvotable={task}
                                                upvotableType="task"
                                                invalidateQueries={[
                                                    [`task/show`, task.id],
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
                                                console.log('Edit Settings clicked');
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
                                {task.is_task_upvoting_enabled && (
                                    <BoxButtonUpvote
                                        project={projectData}
                                        showUpvotesCount={false}
                                        showIcon={true}
                                        upvotable={task}
                                        upvotableType="task"
                                        invalidateQueries={[
                                            [`task/show`, task.id],
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

export default FormEditTask;

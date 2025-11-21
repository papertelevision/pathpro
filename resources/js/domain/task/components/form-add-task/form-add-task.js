/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import qs from 'qs';

/**
 * Internal dependencies
 */
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormTextArea from '@app/components/form/form-textarea';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormSelect from '@app/components/form/form-select';
import FormFileUpload from '@app/components/form/form-file-upload';
import FormAddTaskSuggestion from '@app/domain/task/components/form-add-task/form-add-task-suggestion';
import Button from '@app/components/button/button';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import useTaskStoreMutation from '@app/data/task/use-task-store-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useQueryContextApi } from '@app/lib/query-context-api';
import FormCloseBtn from '@app/components/form/form-close-btn';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    task_type_id: yup.string().required('This field is required.'),
    task_group_id: yup.string().required('This field is required.'),
    task_status_id: yup.string().required('This field is required.'),
});

const FormAddTask = ({
    statuses,
    types,
    project,
    taskGroupID,
    handleFormState = () => {},
    closeModal,
    setIsFormChanged,
    setIsAddTaskModalOpen,
}) => {
    const defaultStatus = statuses.find(
        (status) => status.title === 'No Status Applied'
    );

    const [firstComment, setFirstComment] = useState();
    const [commentTextAreaData, setCommentTextAreaData] = useState('');
    const [suggestionPinnedToTop, setSuggestionPinnedToTop] = useState(false);

    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { canPinComments } = usePermissionsContextApi();

    const { taskVisibilities: visibilities } = useQueryContextApi();
    const { mutate: mutateTasks } = useTaskStoreMutation(
        projectSlug,
        queryArgs
    );

    const methods = useForm({
        defaultValues: {
            title: '',
            description: '',
            visibility: visibilities[0].id,
            team_members: [],
            community_members: [],
            task_group_id: '',
            task_type_id: '',
            task_status_id: defaultStatus?.id,
            are_subtasks_allowed: false,
            is_task_upvoting_enabled: false,
            are_stats_public: false,
            are_comments_enabled: true,
            is_comment_upvoting_allowed: true,
            are_team_members_visible: true,
            is_creator_visible: true,
            has_first_comment: false,
            is_comment_pinned_to_top: false,
            comment_content: '',
            attachments: [],
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleTextArea = () => {
        methods.setValue('has_first_comment', true);
        setFirstComment(methods.getValues('comment_content'));
        setCommentTextAreaData('');
    };

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

        mutateTasks(payload, {
            onSuccess: () => {
                setIsAddTaskModalOpen(false);
                handleFormState((formIndex) => formIndex + 1);
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
                modifier="task"
            >
                <Form.Content>
                    <Form.ColLeft>
                        <div className="form__col-head">
                            <h3>Add Task</h3>
                        </div>
                        <FormField title="Title" id="title" name="title" />
                        <RichTextEditor
                            label="Description"
                            name="description"
                            placeholder="Describe your task, feature, goal or idea here."
                        />
                        <FormFileUpload
                            id="attachments"
                            name="attachments"
                            marginBottom
                        />
                        <FormSelect
                            title="Type"
                            id="task_type_id"
                            name="task_type_id"
                            selected={types[0].id}
                            data={types}
                            type
                        />
                        <FormCheckbox
                            id="are_subtasks_allowed"
                            name="are_subtasks_allowed"
                            description="This task includes multiple sub-tasks"
                            marginBottom
                        />
                        <FormSelect
                            title="Add to Task Group"
                            id="task_group_id"
                            name="task_group_id"
                            selected={
                                taskGroupID
                                    ? taskGroupID
                                    : project.task_groups[0].id
                            }
                            data={project.task_groups}
                            marginBottom
                        />
                        <FormSelect
                            title="Visibility"
                            id="visibility"
                            name="visibility"
                            selected={visibilities[0].id}
                            data={visibilities}
                            marginBottom
                        />
                        <FormSelect
                            title="Status"
                            id="task_status_id"
                            name="task_status_id"
                            placeholder="Please select status..."
                            selected={defaultStatus?.id}
                            data={statuses}
                            marginBottom
                        />
                        <MultipleSelectField
                            title="Assign Team Member(s):"
                            id="team_members"
                            name="team_members"
                            placeholder="Start typing to add team member to overall project..."
                            data={[...project.team_members, project.creator]}
                        />
                        {methods.watch('team_members')?.length > 0 && (
                            <FormCheckbox
                                id="are_team_members_visible"
                                name="are_team_members_visible"
                                description="Show team member(s) on front-end"
                                marginBottom
                            />
                        )}
                        <MultipleSelectField
                            title="Give Credit to User(s):"
                            id="community_members"
                            name="community_members"
                            placeholder="Start typing to add users..."
                            data={project.community_members}
                        />
                    </Form.ColLeft>

                    <Form.ColRight>
                        <div className="form__col-head">
                            <h3>Discussion</h3>
                            <FormCloseBtn onClick={closeModal} />
                        </div>
                        <div className="form-boxes">
                            <div className="form-boxes__item form-boxes__item--auto">
                                <div className="form-boxes__row">
                                    <div className="form-boxes__col">
                                        <span>Feature / Task Upvoting</span>
                                        <FormCheckbox
                                            id="is_task_upvoting_enabled"
                                            name="is_task_upvoting_enabled"
                                            description="Enable Upvoting"
                                        />
                                        <FormCheckbox
                                            id="are_stats_public"
                                            name="are_stats_public"
                                            description="Display Stats"
                                            marginBottom
                                        />
                                    </div>
                                    <div className="form-boxes__col">
                                        <span>Discussion Settings</span>
                                        <FormCheckbox
                                            id="are_comments_enabled"
                                            name="are_comments_enabled"
                                            description="Enable Comments & Suggestions"
                                            onClick={(e) =>
                                                methods.setValue(
                                                    'are_comments_enabled',
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <FormCheckbox
                                            id="is_comment_upvoting_allowed"
                                            name="is_comment_upvoting_allowed"
                                            description="Allow Comment Upvoting"
                                            marginBottom
                                        />
                                    </div>
                                </div>
                                {methods.watch('are_comments_enabled') && (
                                    <>
                                        <div className="form__suggestion">
                                            <FormTextArea
                                                title="Add Feedback or Suggestion:"
                                                id="comment_content"
                                                name="comment_content"
                                                setTextAreaValue={
                                                    setCommentTextAreaData
                                                }
                                                textAreaValue={
                                                    commentTextAreaData
                                                }
                                            />
                                            <div className="form__suggestion-actions">
                                                <Button
                                                    type="button"
                                                    modifier="rectangular"
                                                    color="is-red"
                                                    onClick={handleTextArea}
                                                >
                                                    Add Comment
                                                </Button>
                                            </div>
                                            {canPinComments(project.id) && (
                                                <FormCheckbox
                                                    id="is_comment_pinned_to_top"
                                                    name="is_comment_pinned_to_top"
                                                    description="Pin Comment to Top"
                                                    onChange={() =>
                                                        setSuggestionPinnedToTop(
                                                            !suggestionPinnedToTop
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                        <div className="form__feedback">
                                            <span>
                                                Feedback & Suggestions (
                                                {firstComment ? 1 : 0})
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                            {methods.watch('are_comments_enabled') && (
                                <div className="form-boxes__item form-boxes__item--scroll">
                                    <FormAddTaskSuggestion
                                        project={project}
                                        firstSuggestion={firstComment}
                                        suggestionPinnedToTop={
                                            suggestionPinnedToTop
                                        }
                                        showSuggestions={firstComment}
                                        commentType="taskComment"
                                    />
                                    {!firstComment && (
                                        <p className="form__feedback-text">
                                            Feedback and suggestions from
                                            subscribers and team members will
                                            appear here after the task has been
                                            created. This valuable feedback from
                                            your audience will help shape the
                                            feature/task, and your overall
                                            product.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Form.ColRight>
                </Form.Content>
                <Form.Footer>
                    <Button
                        type="button"
                        color="is-transparent"
                        modifier="rectangular"
                        onClick={handleClickCancelButton}
                    >
                        Close
                    </Button>
                    <Button type="submit" modifier="rectangular" color="is-red">
                        Create
                    </Button>
                </Form.Footer>
            </Form>
        </FormProvider>
    );
};
export default FormAddTask;

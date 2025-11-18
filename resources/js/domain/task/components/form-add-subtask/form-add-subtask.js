/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLocation } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import qs from 'qs';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';
import Form from '@app/components/form/form';
import FormField from '@app/components/form/form-field';
import FormTextArea from '@app/components/form/form-textarea';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormSelect from '@app/components/form/form-select';
import FormAddTaskSuggestion from '@app/domain/task/components/form-add-task/form-add-task-suggestion';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import MultipleSelectField from '@app/components/multiple-select-field/multiple-select-field';
import useSubtaskStoreMutation from '@app/data/subtask/use-subtask-store-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useQueryContextApi } from '@app/lib/query-context-api';
import FormCloseBtn from '@app/components/form/form-close-btn';

const schema = yup.object().shape({
    title: yup.string().required('This field is required.'),
    task_type_id: yup.string().required('This field is required.'),
    task_status_id: yup.string().required('This field is required.'),
});

const FormAddSubTask = ({
    types,
    statuses,
    parentTaskData,
    project,
    closeModal,
    setIsFormChanged,
    setIsAddSubTaskModalOpen,
}) => {
    const defaultStatus = statuses.find(
        (status) => status.title === 'No Status Applied'
    );
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { taskVisibilities: visibilities } = useQueryContextApi();
    const { canPinComments } = usePermissionsContextApi();
    const [firstComment, setFirstComment] = useState();
    const [commentTextAreaData, setCommentTextAreaData] = useState('');
    const [commentPinnedToTop, setCommentPinnedToTop] = useState(false);

    const { mutate: mutateSubtaskStore } = useSubtaskStoreMutation(
        project.slug,
        queryArgs
    );

    const methods = useForm({
        defaultValues: {
            title: '',
            description: '',
            visibility: visibilities[0].id,
            parent_task_id: parentTaskData.id,
            task_type_id: '',
            task_status_id: defaultStatus?.id,
            team_members: [],
            community_members: [],
            are_team_members_visible: true,
            is_creator_visible: true,
            are_comments_enabled: true,
            are_stats_public: false,
            is_task_upvoting_enabled: false,
            is_comment_upvoting_allowed: true,
            is_comment_pinned_to_top: false,
            has_first_comment: false,
            is_comment_pinned_to_top: false,
            comment_content: '',
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleTextArea = () => {
        methods.setValue('has_first_comment', true);
        setFirstComment(methods.getValues('comment_content'));
        setCommentTextAreaData('');
    };

    const handleFormSubmit = (values) =>
        mutateSubtaskStore(
            {
                ...values,
                team_members: values.team_members.map((item) => item.value),
                community_members: values.community_members.map(
                    (item) => item.value
                ),
            },
            {
                onSuccess: () => setIsAddSubTaskModalOpen(false),
            }
        );

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
                            <h3>Add Subtask</h3>
                        </div>
                        <FormField title="Title" id="title" name="title" />
                        <RichTextEditor
                            label="Description"
                            name="description"
                            placeholder="Describe your task, feature, goal or idea here."
                        />
                        <FormSelect
                            title="Type"
                            id="task_type_id"
                            name="task_type_id"
                            selected={types[0].id}
                            data={types}
                            type
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
                            topMenu
                            marginBottom
                        />
                        <MultipleSelectField
                            title="Assign Team Member(s):"
                            id="team_members"
                            name="team_members"
                            placeholder="Start typing to add team member to overall project..."
                            data={project.team_members}
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
                                        <span>Feature Voting & Stats </span>
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
                                                        setCommentPinnedToTop(
                                                            !commentPinnedToTop
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
                                            commentPinnedToTop
                                        }
                                        showSuggestions={firstComment}
                                        commentType="taskComment"
                                    />
                                    {!firstComment && (
                                        <p className="form__feedback-text">
                                            Feedback and suggestions from
                                            subscribers and team members will
                                            appear here after the subtask has
                                            been created. This valuable feedback
                                            from your audience will help shape
                                            the feature/task, and your overall
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

export default FormAddSubTask;

/**
 * External dependencies
 */
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import qs from 'qs';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import FormRowBox from '@app/components/form/form-row-box';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormInlineFileUpload from '@app/components/form/form-inline-file-upload';
import Button from '@app/components/button/button';
import RichTextEditor from '@app/components/rich-text-editor/rich-text-editor';
import useCommentStoreMutation from '@app/data/comment/use-comment-store-mutation';
import useProjectCommunityMemberStoreMutation from '@app/data/project/use-project-community-member-store-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schema = yup.object().shape({
    content: yup.string().required('This field is required.'),
});

const AddCommentSection = ({ task, project, modelType, sortCommentsBy, hideTitle = false }) => {
    const { isUserLoggedIn, canPinComments, isAuthUserAssignToProject, canUploadAttachments } =
        usePermissionsContextApi();

    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });
    const queryClient = useQueryClient();

    const { mutate: mutateCommentStore } = useCommentStoreMutation(projectSlug);
    const { mutate: mutateCommunityMemberStore } =
        useProjectCommunityMemberStoreMutation(project.slug);

    const invalidateQueriesArray = [
        ['task/comments/show/', task.id, sortCommentsBy],
        ['feature/comments/show/', task.id, sortCommentsBy],
        [`task/show`, task.id],
        [`feature/show`, task.id],
        ['projects/task-groups/index', projectSlug, queryArgs],
        ['project/features/index', projectSlug, queryArgs],
    ];

    const methods = useForm({
        defaultValues: {
            content: '',
            is_comment_pinned_to_top: false,
            attachments: [],
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const handleSuggestionSubmit = (values) => {
        values.commentable_id = task.id;
        values.commentable_type = modelType;

        // Check if there are file attachments
        const hasFiles = values.attachments && values.attachments.length > 0;

        let payload;
        if (hasFiles) {
            // Use FormData for file uploads
            const formData = new FormData();

            // Add regular fields
            formData.append('content', values.content);
            formData.append('is_comment_pinned_to_top', values.is_comment_pinned_to_top ? '1' : '0');
            formData.append('commentable_id', values.commentable_id);
            formData.append('commentable_type', values.commentable_type);

            // Add files
            values.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });

            payload = formData;
        } else {
            payload = values;
        }

        mutateCommentStore(payload, {
            onSuccess: () => {
                methods.reset();

                invalidateQueriesArray.map((query) =>
                    queryClient.invalidateQueries(query)
                );
            },
        });
    };

    return isAuthUserAssignToProject(project.id) ? (
        <FormProvider {...methods}>
            <div className="form__suggestion">
                <RichTextEditor
                    id={`comment-${task.id}`}
                    name="content"
                    label={hideTitle ? "" : "Add Feedback or Suggestion:"}
                    placeholder="Add your comment..."
                    hideErrorMessage={true}
                />
                <div className="form__suggestion-actions">
                    {canUploadAttachments && (canPinComments(task.project_id) ||
                      project.team_members?.some(member => member.id === isUserLoggedIn?.id) ||
                      project.creator?.id === isUserLoggedIn?.id) && (
                        <FormInlineFileUpload uniqueId="main-comment" />
                    )}
                    <Button
                        type="button"
                        modifier="rectangular"
                        color="is-red"
                        onClick={methods.handleSubmit(handleSuggestionSubmit)}
                    >
                        Add Comment
                    </Button>
                </div>
                {canPinComments(task.project_id) && (
                    <FormCheckbox
                        id="is_comment_pinned_to_top"
                        name="is_comment_pinned_to_top"
                        description="Pin Comment on Top"
                    />
                )}
            </div>
        </FormProvider>
    ) : (
        <>
            <span>Add Feedback or Suggestion:</span>
            {isUserLoggedIn ? (
                <FormRowBox
                    modifier="info"
                    title={
                        <>
                            Have a suggestion?
                            <NavLink
                                onClick={() => mutateCommunityMemberStore()}
                            >
                                Join Product
                            </NavLink>
                        </>
                    }
                />
            ) : (
                <FormRowBox
                    modifier="info"
                    title={
                        <>
                            Have a suggestion?
                            <NavLink
                                to={`/register/${project.slug}`}
                                state={{
                                    redirectTo: `/${project.slug}/${modelType}/${task.id}`,
                                }}
                            >
                                Click here to join the conversation
                            </NavLink>
                        </>
                    }
                    text={
                        <>
                            Already joined?
                            <NavLink
                                to="/login"
                                state={{
                                    redirectTo: `/${project.slug}/${modelType}/${task.id}`,
                                }}
                            >
                                Login Here
                            </NavLink>
                        </>
                    }
                />
            )}
        </>
    );
};

export default AddCommentSection;

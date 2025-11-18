/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import classNames from 'classnames';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Internal dependencies
 */
import FormTextArea from '@app/components/form/form-textarea';
import FormInlineFileUpload from '@app/components/form/form-inline-file-upload';
import Button from '@app/components/button/button';
import useCommentStoreMutation from '@app/data/comment/use-comment-store-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const schemaComments = yup.object().shape({
    content: yup.string().required('This field is required.'),
});

const AddCommentReplySection = ({
    task,
    project,
    idx,
    isReplySubmitSectionActive,
    suggestion,
    handleShowReplySection,
    sortCommentsBy,
}) => {
    const [textAreaValue, setTextAreaValue] = useState('');

    const { isUserLoggedIn, canPinComments } = usePermissionsContextApi();

    const queryClient = useQueryClient();

    const { mutate: mutateCommentStore } = useCommentStoreMutation(projectSlug);

    const methodsCommentsReply = useForm({
        defaultValues: {
            content: '',
            is_comment_pinned_to_top: false,
            attachments: [],
        },
        mode: 'all',
        resolver: yupResolver(schemaComments),
    });

    const handleCommentReplySubmit = (values) => {
        values.parent_comment_id = suggestion.id;
        values.commentable_id = task.id;
        values.commentable_type = task.model_type;

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
            formData.append('parent_comment_id', values.parent_comment_id);

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
                setTextAreaValue('');
                methodsCommentsReply.reset();
                handleShowReplySection(-1);

                queryClient.invalidateQueries([
                    'task/comments/show/',
                    task.id,
                    sortCommentsBy,
                ]);
                queryClient.invalidateQueries([
                    'feature/comments/show/',
                    task.id,
                    sortCommentsBy,
                ]);
            },
        });
    };

    return (
        <FormProvider {...methodsCommentsReply}>
            <div
                className={classNames('reply-section', {
                    'is-active': isReplySubmitSectionActive(idx),
                })}
            >
                <FormTextArea
                    title="Add Reply to Suggestion:"
                    id="content"
                    name="content"
                    setTextAreaValue={setTextAreaValue}
                    textAreaValue={textAreaValue}
                />
                <div className="reply-section__actions">
                    <Button
                        type="button"
                        rounded
                        larger
                        margin
                        color="black"
                        onClick={methodsCommentsReply.handleSubmit(
                            handleCommentReplySubmit
                        )}
                    >
                        Submit
                    </Button>
                    {(canPinComments(task.project_id) ||
                      project.team_members?.some(member => member.id === isUserLoggedIn?.id) ||
                      project.creator?.id === isUserLoggedIn?.id) && (
                        <FormInlineFileUpload uniqueId={`reply-${suggestion.id}`} />
                    )}
                </div>
            </div>
        </FormProvider>
    );
};

export default AddCommentReplySection;

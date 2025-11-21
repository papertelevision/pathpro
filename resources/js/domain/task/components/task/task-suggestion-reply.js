/**
 * External dependencies
 */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/**
 * Internal dependencies
 */
import AlertBox from '@app/components/alert-box/alert-box';
import ButtonIcon from '@app/components/button/button-icon';
import Suggestion from '@app/components/suggestion/suggestion';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import SuggestionFooter from '@app/components/suggestion/suggestion-footer';
import AttachmentList from '@app/components/attachment/attachment-list';
import useCommentDestroyMutation from '@app/data/comment/use-comment-destroy-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const TaskSuggestionReply = ({ reply, project, sortCommentsBy, isEditMode = false }) => {
    let dateFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    };
    let suggestionDate = new Date(reply.created_at);

    let formatedDate = `${suggestionDate.toLocaleDateString(
        'en-US',
        dateFormatOptions
    )} at ${suggestionDate.getHours()}:${suggestionDate.getMinutes()} est`;

    const [openAlertBox, setOpenAlertBox] = useState(false);
    const queryClient = useQueryClient();

    const { isUserLoggedIn, authUser, canDeleteComments, canUpdateProject } =
        usePermissionsContextApi();

    const { mutate: mutateCommentDestroy } = useCommentDestroyMutation(
        reply.id,
        reply.commentable_id,
        sortCommentsBy
    );

    const handleDestroyCommentMutation = () =>
        mutateCommentDestroy(
            {},
            {
                onSuccess: () => setOpenAlertBox(false),
            }
        );

    const handleAttachmentDelete = () => {
        // Invalidate queries to refresh the reply and show updated attachments
        queryClient.invalidateQueries([
            'task/comments/show/',
            reply.commentable_id,
            sortCommentsBy,
        ]);
        queryClient.invalidateQueries([
            'feature/comments/show/',
            reply.commentable_id,
            sortCommentsBy,
        ]);
    };

    const authorPage =
        reply.author.id === authUser?.id
            ? '/account'
            : reply.author?.is_banned
            ? `/banned-members/${reply.author.id}`
            : reply.author.rank?.role === 'Community Member'
            ? `/community-members/${reply.author.id}`
            : `/team-members/${reply.author.id}`;

    return (
        <>
            <Suggestion modifier="reply">
                <Suggestion.Left>
                    <TooltipUserAvatar
                        user={reply.author}
                        isUsernameVisible={false}
                        projectSlug={project.slug}
                    />
                </Suggestion.Left>
                <Suggestion.Right>
                    <span className="suggestion__username">
                        @
                        {reply.author.id === authUser?.id ||
                        canUpdateProject(null, project.slug) ? (
                            <NavLink to={authorPage}>
                                {reply.author.username}
                            </NavLink>
                        ) : (
                            reply.author.username
                        )}
                    </span>
                    <span>{formatedDate}</span>
                    <p className="suggestion__content reply">
                        {parse(DOMPurify.sanitize(reply.content, { ADD_ATTR: ['target'] }))}
                    </p>
                    {reply.attachments && reply.attachments.length > 0 && (
                        <AttachmentList
                            attachments={reply.attachments}
                            canDelete={authUser?.id === reply.author.id && isEditMode}
                            showSubtitle={false}
                            onDelete={handleAttachmentDelete}
                        />
                    )}
                    <SuggestionFooter>
                        <div className="suggestion__footer-left"></div>
                        {isUserLoggedIn && canDeleteComments(project.id) && isEditMode && (
                            <div className="suggestion__footer-right">
                                <ButtonIcon
                                    iconType="trash"
                                    hasBorder
                                    onClick={() => setOpenAlertBox(true)}
                                />
                            </div>
                        )}
                    </SuggestionFooter>
                </Suggestion.Right>
            </Suggestion>

            <AlertBox
                isActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                deleteAction={handleDestroyCommentMutation}
                message="Are you sure you wish to delete this comment/suggestion? This cannot be undone."
                confirmButtonType="button"
            />
        </>
    );
};

export default TaskSuggestionReply;

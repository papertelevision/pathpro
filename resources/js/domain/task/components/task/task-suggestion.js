/**
 * External dependencies
 */
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { debounce } from 'lodash';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/**
 * Internal dependencies
 */
import AlertBox from '@app/components/alert-box/alert-box';
import ButtonIcon from '@app/components/button/button-icon';
import Suggestion from '@app/components/suggestion/suggestion';
import SuggestionFooter from '@app/components/suggestion/suggestion-footer';
import FormCheckbox from '@app/components/form/form-checkbox';
import BoxButton from '@app/components/box/box-button';
import BoxButtonUpvote from '@app/components/box/box-button-upvote';
import BoxButtonShare from '@app/components/box/box-button-share';
import TooltipUserAvatar from '@app/components/tooltip/tooltip-user-avatar';
import SuggestionIconCircle from '@app/components/suggestion/suggestion__icon-circle';
import AttachmentList from '@app/components/attachment/attachment-list';
import useCommentUpdateMutation from '@app/data/comment/use-comment-update-mutation';
import useCommentDestroyMutation from '@app/data/comment/use-comment-destroy-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { dateFormat } from '@app/lib/date-format';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TaskSuggestion = ({
    commentableId,
    project,
    suggestion,
    handleShowReplySection,
    index,
    firstSuggestion,
    commentType,
    isCommentUpvotingAllowed = true,
    sortCommentsBy,
    isEditMode = false,
}) => {
    const [showHighlightCommentSpinner, setShowHighlightCommentSpinner] =
        useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);

    const {
        authUser,
        canPinComments,
        canDeleteComments,
        canUpdateProject,
        isUserLoggedIn,
        isAuthUserAdmitOrTeamMember,
        isAuthUserAssignToProject,
        canUploadAttachments,
    } = usePermissionsContextApi();

    const refToSuggestion = useRef(null);
    const queryClient = useQueryClient();

    const { taskId, featureId, commentId } = useParams();

    const { mutate: mutateCommentUpdate } = useCommentUpdateMutation(
        suggestion.id,
        commentableId || taskId,
        sortCommentsBy
    );

    const { mutate: mutateCommentDestroy } = useCommentDestroyMutation(
        suggestion.id,
        commentableId || taskId,
        sortCommentsBy
    );

    const handleAttachmentDelete = () => {
        // Invalidate queries to refresh the comment and show updated attachments
        queryClient.invalidateQueries([
            'task/comments/show/',
            parseInt(taskId),
            sortCommentsBy,
        ]);
        queryClient.invalidateQueries([
            'feature/comments/show/',
            commentableId || parseInt(featureId),
            sortCommentsBy,
        ]);
    };

    const handlePinCommentToTop = (e) => {
        mutateCommentUpdate({
            is_comment_pinned_to_top: e.target.checked,
        });
    };

    const handleHighlightComment = () => {
        setShowHighlightCommentSpinner(true);

        mutateCommentUpdate(
            {
                is_comment_highlighted: !suggestion.is_comment_highlighted,
            },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        setShowHighlightCommentSpinner(false);
                    }, 1000);
                },
            }
        );
    };

    const handleDestroyCommentMutation = () =>
        mutateCommentDestroy(
            {},
            {
                onSuccess: () => setOpenAlertBox(false),
            }
        );

    useEffect(() => {
        parseInt(commentId) === suggestion.id &&
            refToSuggestion.current.scrollIntoView();
    }, [commentId, suggestion]);

    const authorPage =
        suggestion.author.id === authUser?.id
            ? '/account'
            : suggestion.author?.is_banned
            ? `/banned-members/${suggestion.author.id}`
            : suggestion.author.rank?.role === 'Community Member'
            ? `/community-members/${suggestion.author.id}`
            : `/team-members/${suggestion.author.id}`;

    return (
        <Fragment>
            <Suggestion
                isLeftBordered={parseInt(commentId) === suggestion.id}
                suggestionRef={refToSuggestion}
            >
                <Suggestion.Left>
                    {isUserLoggedIn &&
                        !firstSuggestion &&
                        isAuthUserAdmitOrTeamMember(project.id) && (
                            <SuggestionIconCircle
                                status={suggestion.is_comment_highlighted}
                                handleAction={handleHighlightComment}
                                showHighlightCommentSpinner={
                                    showHighlightCommentSpinner
                                }
                            />
                        )}
                    <TooltipUserAvatar
                        user={suggestion.author}
                        isUsernameVisible={false}
                        projectSlug={project.slug}
                    />
                </Suggestion.Left>
                <Suggestion.Right>
                    <span className="suggestion__username">
                        @
                        {suggestion.author.id === authUser?.id ||
                        canUpdateProject(null, project.slug) ? (
                            <NavLink to={authorPage}>
                                {suggestion.author.username}
                            </NavLink>
                        ) : (
                            suggestion.author.username
                        )}
                    </span>
                    <span>
                        {dateFormat(
                            suggestion.created_at,
                            project.date_format,
                            true
                        )}
                    </span>
                    <p className="suggestion__content">
                        {suggestion.highest_upvoted ? (
                            <Fragment>
                                <i>Highest upvoted comment! </i>{' '}
                                {parse(DOMPurify.sanitize(suggestion.content, { ADD_ATTR: ['target'] }))}
                            </Fragment>
                        ) : (
                            parse(DOMPurify.sanitize(suggestion.content, { ADD_ATTR: ['target'] }))
                        )}
                    </p>
                    {canUploadAttachments && suggestion.attachments && suggestion.attachments.length > 0 && (
                        <AttachmentList
                            attachments={suggestion.attachments}
                            canDelete={authUser?.id === suggestion.author.id && isEditMode}
                            showSubtitle={false}
                            onDelete={handleAttachmentDelete}
                        />
                    )}
                    <SuggestionFooter>
                        {!firstSuggestion && (
                            <div className="suggestion__footer-left">
                                {canPinComments(project.id) && isEditMode && (
                                    <FormCheckbox
                                        id={`is_comment_pinned_to_top-${suggestion.id}`}
                                        name={`is_comment_pinned_to_top-${suggestion.id}`}
                                        description="Pin to Top"
                                        notControlled
                                        defaultChecked={
                                            suggestion.is_comment_pinned_to_top
                                        }
                                        onChange={debounce(
                                            (e) => handlePinCommentToTop(e),
                                            500
                                        )}
                                    />
                                )}
                            </div>
                        )}
                        <div className="suggestion__footer-right">
                            {!firstSuggestion && (
                                <Fragment>
                                    <BoxButtonShare
                                        icon
                                        subtask
                                        text="Link"
                                        shareObject="comment"
                                        shareUrl={
                                            commentType === 'featureComment'
                                                ? `/feature/${commentableId}/comment/${suggestion.id}`
                                                : `/task/${commentableId}/comment/${suggestion.id}`
                                        }
                                    />

                                    {isCommentUpvotingAllowed && (
                                        <BoxButtonUpvote
                                            project={project}
                                            showUpvotesCountAfterText
                                            showUpvotesCount={false}
                                            showIcon={true}
                                            upvotable={suggestion}
                                            upvotableType="comment"
                                            invalidateQueries={[
                                                [
                                                    'task/comments/show/',
                                                    parseInt(taskId),
                                                    sortCommentsBy,
                                                ],
                                                [
                                                    'feature/comments/show/',
                                                    commentableId ||
                                                        parseInt(featureId),
                                                    sortCommentsBy,
                                                ],
                                                [
                                                    'project/release-notes/index',
                                                    projectSlug,
                                                ],
                                            ]}
                                        />
                                    )}
                                    <BoxButton
                                        disabled={
                                            !isAuthUserAssignToProject(
                                                null,
                                                project.slug
                                            )
                                        }
                                        onClick={() =>
                                            handleShowReplySection(index)
                                        }
                                    >
                                        <span>Reply</span>
                                    </BoxButton>
                                    {isUserLoggedIn &&
                                        canDeleteComments(project.id) &&
                                        isEditMode && (
                                            <ButtonIcon
                                                iconType="trash"
                                                hasBorder
                                                onClick={() =>
                                                    setOpenAlertBox(true)
                                                }
                                            />
                                        )}
                                </Fragment>
                            )}
                        </div>
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
        </Fragment>
    );
};

export default TaskSuggestion;

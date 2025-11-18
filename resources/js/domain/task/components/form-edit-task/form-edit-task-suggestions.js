/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import Accordion from '@app/components/accordion/accordion';
import AccordionSection from '@app/components/accordion/accordion-section';
import AccordionHeader from '@app/components/accordion/accordion-header';
import AccordionBody from '@app/components/accordion/accordion-body';
import TaskSuggestion from '@app/domain/task/components/task/task-suggestion';
import TaskSuggestionReply from '@app/domain/task/components/task/task-suggestion-reply';
import AddCommentReplySection from '@app/domain/comment/components/add-comment-reply-section';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const FormEditTaskSuggestions = ({
    project,
    suggestions,
    task,
    sortCommentsBy,
    commentType = 'taskComment',
    isEditMode = false,
}) => {
    const [replySubmitSection, setReplySubmitSectionVisible] = useState();

    const { isUserLoggedIn, isAuthUserCommunityMember } =
        usePermissionsContextApi();

    const isReplySubmitSectionActive = (component) =>
        component === replySubmitSection;

    const handleShowReplySection = (component) => {
        setReplySubmitSectionVisible((prevActiveSection) =>
            prevActiveSection === component ? null : component
        );
    };

    if (!suggestions) {
        return null;
    }

    return (
        <Accordion
            active
            editTask
            className={
                (!isUserLoggedIn ||
                    isAuthUserCommunityMember(task.project_id)) &&
                'is-static'
            }
        >
            {suggestions.map((item, idx) => {
                return (
                    <AccordionSection key={item.id}>
                        <AccordionHeader
                            suggestions
                            replies={item.replies.length > 0 && item.replies}
                            className="accordion__header-left--reply"
                        >
                            <TaskSuggestion
                                commentableId={task.id}
                                project={project}
                                suggestion={item}
                                isCommentUpvotingAllowed={
                                    task.is_comment_upvoting_allowed
                                }
                                index={idx}
                                handleShowReplySection={handleShowReplySection}
                                commentType={commentType}
                                sortCommentsBy={sortCommentsBy}
                                isEditMode={isEditMode}
                            />
                            <AddCommentReplySection
                                idx={idx}
                                task={task}
                                project={project}
                                suggestion={item}
                                isReplySubmitSectionActive={
                                    isReplySubmitSectionActive
                                }
                                handleShowReplySection={handleShowReplySection}
                                sortCommentsBy={sortCommentsBy}
                            />
                        </AccordionHeader>
                        {item.replies?.length > 0 ? (
                            <AccordionBody>
                                {item.replies.map((item, idx) => (
                                    <TaskSuggestionReply
                                        key={idx}
                                        reply={item}
                                        project={project}
                                        sortCommentsBy={sortCommentsBy}
                                        isEditMode={isEditMode}
                                    />
                                ))}
                            </AccordionBody>
                        ) : (
                            <></>
                        )}
                    </AccordionSection>
                );
            })}
        </Accordion>
    );
};

export default FormEditTaskSuggestions;

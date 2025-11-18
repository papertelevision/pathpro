/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Accordion from '@app/components/accordion/accordion';
import AccordionSection from '@app/components/accordion/accordion-section';
import AccordionHeader from '@app/components/accordion/accordion-header';
import TaskSuggestion from '@app/domain/task/components/task/task-suggestion';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const FormAddTaskSuggestion = ({
    project,
    firstSuggestion,
    showSuggestions,
    suggestionPinnedToTop,
    commentType,
}) => {
    const { authUser } = usePermissionsContextApi();

    const suggestionData = {
        content: firstSuggestion,
        is_comment_pinned_to_top: suggestionPinnedToTop ? 1 : 0,
        created_at: new Date(),
        upvotes: 0,
        author: authUser,
    };

    return (
        <Accordion active={showSuggestions} editTask>
            <AccordionSection padding>
                <AccordionHeader suggestions>
                    <TaskSuggestion
                        project={project}
                        suggestion={suggestionData}
                        firstSuggestion
                        commentType={commentType}
                    />
                </AccordionHeader>
            </AccordionSection>
        </Accordion>
    );
};

export default FormAddTaskSuggestion;

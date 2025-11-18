/**
 * External dependencies
 */
import React, { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import AccordionContextProvider from '@app/components/accordion/api/accordion-context';

const Accordion = forwardRef(
    (
        {
            children,
            active,
            suggestions,
            editTask,
            projectMemberPermissions,
            className,
            modifier,
        },
        ref
    ) => (
        <div
            ref={ref}
            className={classNames('accordion', className, {
                'active': active,
                'suggestions': suggestions,
                'accordion--suggestions-edit-task': editTask,
                'accordion--project-member-permissions':
                    projectMemberPermissions,
                [`accordion--${modifier}`]: modifier,
            })}
        >
            <AccordionContextProvider>{children}</AccordionContextProvider>
        </div>
    )
);

export default Accordion;

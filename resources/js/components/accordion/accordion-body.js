/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { useAccordionSection } from '@app/components/accordion/api/accordion-context';

const AccordionBody = ({ children, index, reply }) => {
    const { isActive } = useAccordionSection();

    return (
        <div
            className={classNames('accordion__body', {
                active: isActive(index),
                reply: reply,
            })}
        >
            <div className="accordion__body-wrapper">{children}</div>
        </div>
    );
};

export default AccordionBody;

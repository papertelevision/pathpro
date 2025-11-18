/**
 * External dependencies
 */
import React, { Children, cloneElement, forwardRef } from 'react';
import classNames from 'classnames';

const AccordionSection = forwardRef(
    ({ children, index, padding, className, ...props }, ref) => (
        <div
            {...props}
            ref={ref}
            className={classNames('accordion__section', className, {
                padding: padding,
            })}
        >
            {Children.map(children, (child) => {
                return cloneElement(child, {
                    ...child.props,
                    index,
                });
            })}
        </div>
    )
);

export default AccordionSection;

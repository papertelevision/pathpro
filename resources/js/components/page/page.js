/**
 * External dependencies
 */
import React, { forwardRef, useState } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { useDragScroll } from '@app/hooks/use-drag-scroll';

const Page = forwardRef(({ children, upper, modifier, color }, ref) => {
    const [isDragging, setIsDragging] = useState(false);

    modifier === 'roadmap' &&
        useDragScroll(
            ref,
            ['page', 'groups__actions', 'groups__container'],
            isDragging,
            setIsDragging
        );

    return (
        <div
            ref={ref}
            className={classNames('page', {
                'is-upper': upper,
                [`page--${modifier}`]: modifier,
                [`is-${color}`]: color,
                [`is-dragging`]: isDragging,
            })}
        >
            {children}
        </div>
    );
});

export default Page;

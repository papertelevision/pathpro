/**
 * External dependencies
 */
import { useEffect } from 'react';

export const useDragScroll = (ref, onElements, isDragging, setIsDragging) =>
    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        let pos = { top: 0, left: 0, x: 0, y: 0 };

        const mouseDownHandler = (e) => {
            if (!e.target || typeof e.target.className !== 'string') return;
            if (
                !isDragging &&
                !onElements.includes(e.target.className.split(' ')[0])
            ) {
                return;
            }

            container.style.cursor = 'grabbing';
            container.style.userSelect = 'none';

            pos = {
                left: container.scrollLeft,
                top: container.scrollTop,
                x: e.clientX,
                y: e.clientY,
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };

        const mouseMoveHandler = (e) => {
            setIsDragging(true);

            const dx = e.clientX - pos.x;
            const dy = e.clientY - pos.y;

            container.scrollTop = pos.top - dy;
            container.scrollLeft = pos.left - dx;
        };

        const mouseUpHandler = () => {
            setIsDragging(false);

            container.style.cursor = 'grab';
            container.style.removeProperty('user-select');

            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        window.addEventListener('scroll', () => {
            document.querySelector('html').scrollLeft = 0;
        });

        container.addEventListener('mousedown', mouseDownHandler);

        return () => {
            container.removeEventListener('mousedown', mouseDownHandler);
        };
    }, [ref]);

/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const Box = ({ children, isColored, modifier, ...props }) => (
    <div
        className={classNames('box', {
            [`box--${modifier}`]: modifier,
        })}
    >
        {isColored && (
            <span
                className="box-color"
                style={{
                    background: `${isColored}`,
                }}
                {...props}
            />
        )}

        {children}
    </div>
);

export default Box;

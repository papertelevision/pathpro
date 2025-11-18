/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const SubheaderLeft = ({ title, icon, separator, children }) => (
    <div className="subheader__left">
        {title && (
            <div
                className={classNames('subheader__title', {
                    separator: separator,
                })}
            >
                <span className="overflow-truncate">{title}</span>
                {icon && icon}
            </div>
        )}
        <span className="subheader__content">{children}</span>
    </div>
);

export default SubheaderLeft;

/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const FormColLeft = ({ children, maxWidth, color }) => (
    <div
        className={classNames('form__col-left', color, {
            'max-width': maxWidth,
        })}
    >
        {children}
    </div>
);

export default FormColLeft;

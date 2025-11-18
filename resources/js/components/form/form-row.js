/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const FormRow = ({
    children,
    opacity,
    marginBottom,
    marginTop,
    opacityMedium,
}) => (
    <div
        className={classNames('form__row', {
            'opacity': opacity,
            'form__row--opacity-medium': opacityMedium,
            'margin-bottom': marginBottom,
            'margin-top': marginTop,
        })}
    >
        {children}
    </div>
);

export default FormRow;

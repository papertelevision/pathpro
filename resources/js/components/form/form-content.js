/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const FormContent = ({ children, fixedHeight, modifier }) => (
    <div
        className={classNames('form__content', {
            'is-height-fixed': fixedHeight,
            [`form__content--${modifier}`]: modifier,
        })}
    >
        {children}
    </div>
);

export default FormContent;

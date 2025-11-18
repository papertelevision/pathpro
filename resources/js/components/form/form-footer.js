/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const FormFooter = ({ children, justify, unbordered, className, modifier }) => (
    <div
        className={classNames('form__footer', className, {
            between: justify,
            unbordered: unbordered,
            [`form__footer--${modifier}`]: modifier,
        })}
    >
        {children}
    </div>
);

export default FormFooter;

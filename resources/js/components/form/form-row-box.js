/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const FormRowBox = ({
    text,
    title,
    smaller,
    colored,
    children,
    modifier,
    className,
    opacityUnset,
}) => (
    <div
        className={classNames('form__row-box', className, {
            'colored': colored,
            'opacity-unset': opacityUnset,
            'form__row-box--smaller': smaller,
            [`form__row-box--${modifier}`]: modifier,
        })}
    >
        {title && <span className="form__row-box-title">{title}</span>}
        {text && <small className="form__row-box-text">{text}</small>}
        {children}
    </div>
);

export default FormRowBox;

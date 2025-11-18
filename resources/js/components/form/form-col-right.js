/**
 * External dependencies
 */
import classNames from 'classnames';
import React from 'react';

const FormColRight = ({ children, className }) => (
    <div className={classNames('form__col-right', className)}>{children}</div>
);

export default FormColRight;

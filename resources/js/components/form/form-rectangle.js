/**
 * External dependencies
 */
import React from 'react';

const FormRectangle = ({ title, children, style }) => (
    <div className="form__rectangle" style={style}>
        <span>{title}</span>
        <strong>{children}</strong>
    </div>
);

export default FormRectangle;

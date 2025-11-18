/**
 * External dependencies.
 */
import React from 'react';

const FormCloseBtn = ({ onClick }) => (
    <div className="form__close">
        <button type="button" onClick={onClick}>
            <span></span>
        </button>
    </div>
);

export default FormCloseBtn;

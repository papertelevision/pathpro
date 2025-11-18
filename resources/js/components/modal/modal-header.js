/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

const ModalHeader = ({ children, closeModal, medium, className }) => {
    return (
        <div
            className={classNames('modal__header', className, {
                medium: medium,
            })}
        >
            {children}
            <button className="modal__header-button" onClick={closeModal}>
                <span></span>
            </button>
        </div>
    );
};

export default ModalHeader;

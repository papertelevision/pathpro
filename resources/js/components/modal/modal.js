/**
 * External dependencies
 */
import React from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import ModalHeader from '@app/components/modal/modal-header';
import ModalContent from '@app/components/modal/modal-content';
import AlertBox from '@app/components/alert-box/alert-box';

const Modal = ({
    larger,
    medium,
    modifier,
    modalIsOpen,
    setFormIndex,
    setFormIndexToZero,
    setFormIndexToThree,
    setIsModalOpen,
    isAlertBoxActive = false,
    setOpenAlertBox = () => {},
    closeModal,
    children,
    urlAddress,
    className,
    disableOutsideClick = false,
}) => (
    <ReactModal
        isOpen={modalIsOpen}
        className={classNames('modal', className, {
            larger: larger,
            medium: medium,
            [`modal--${modifier}`]: modifier,
        })}
        onRequestClose={
            disableOutsideClick
                ? (e) => e.type !== 'click' && closeModal()
                : closeModal
        }
        closeTimeoutMS={150}
    >
        <div className="modal__container">{children}</div>

        <AlertBox
            setFormIndex={setFormIndex}
            setFormIndexToZero={setFormIndexToZero}
            setFormIndexToThree={setFormIndexToThree}
            setIsModalOpen={setIsModalOpen}
            isActive={isAlertBoxActive}
            setOpenAlertBox={setOpenAlertBox}
            urlAddress={urlAddress}
            message="There are unsaved modifications to the form. Are you sure
                you want to close it ?"
        />
    </ReactModal>
);

Modal.Header = ModalHeader;
Modal.Content = ModalContent;

export default Modal;

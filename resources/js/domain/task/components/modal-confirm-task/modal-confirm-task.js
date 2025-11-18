/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import Button from '@app/components/button/button';
import Icon from '@app/components/icon/icon';

const ModalConfirmTask = ({
    handleFormState,
    closeModal,
    setIsAddTaskModalOpen,
}) => {
    const handleOpenAddTaskModal = () => {
        handleFormState((formIndex) => formIndex + 1);
        setIsAddTaskModalOpen(true);
    };

    return (
        <Modal.Content>
            <div className="modal__content-wrapper modal__content-wrapper--group-created">
                <div className="modal__content-icon">
                    <Icon type="high_five" />
                </div>
                <div className="modal__content-text">
                    <h3>Task Group Created!</h3>
                    <p>
                        Wow, another virtual high five! You've now created a
                        comfy home for <b>features/ideas/tasks</b> that seem
                        better together. However, it's a bit sparse in here.
                        Create your first <b>task</b> below and get rid of that
                        lonely feeling.
                    </p>
                </div>
                <div className="modal__content-button-wrapper">
                    <Button
                        type="button"
                        rounded
                        larger
                        color="blue"
                        onClick={handleOpenAddTaskModal}
                    >
                        Add first task to this Task Group
                    </Button>
                    <span>Recommended</span>
                </div>
                <div className="modal__content-button-wrapper">
                    <Button type="button" color="red-text" onClick={closeModal}>
                        Close this window and add tasks later
                    </Button>
                </div>
            </div>
        </Modal.Content>
    );
};

export default ModalConfirmTask;

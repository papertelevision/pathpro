/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormAddTaskGroup from '@app/domain/task-group/components/form-add-task-group/form-add-task-group';

const ModalAddTaskGroup = ({
    project,
    closeModal,
    handleFormState,
    setIsFormChanged,
    setIsAddTaskGroupModalOpen,
}) => (
    <Modal.Content>
        <FormAddTaskGroup
            project={project}
            closeModal={closeModal}
            handleFormState={handleFormState}
            setIsFormChanged={setIsFormChanged}
            setIsAddTaskGroupModalOpen={setIsAddTaskGroupModalOpen}
        />
    </Modal.Content>
);

export default ModalAddTaskGroup;

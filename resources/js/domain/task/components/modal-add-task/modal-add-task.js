/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormAddTask from '@app/domain/task/components/form-add-task/form-add-task';

const ModalAddTask = ({
    taskStatuses,
    taskTypes,
    project,
    handleFormState,
    closeModal,
    setIsFormChanged,
    setIsAddTaskModalOpen,
}) => (
    <Modal.Content>
        <FormAddTask
            statuses={taskStatuses}
            types={taskTypes}
            project={project}
            handleFormState={handleFormState}
            closeModal={closeModal}
            setIsFormChanged={setIsFormChanged}
            setIsAddTaskModalOpen={setIsAddTaskModalOpen}
        />
    </Modal.Content>
);

export default ModalAddTask;

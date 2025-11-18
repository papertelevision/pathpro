/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormEditProject from '@app/domain/project/components/form-edit-project/form-edit-project';

const ModalEditProject = ({
    project,
    setIsFormChanged,
    closeEditProjectModal,
    setIsEditProjectModalOpen,
    isEditProjectModalOpen,
}) => (
    <Modal.Content>
        <FormEditProject
            project={project}
            closeModal={closeEditProjectModal}
            setIsFormChanged={setIsFormChanged}
            isEditProjectModalOpen={isEditProjectModalOpen}
            setIsModalOpen={setIsEditProjectModalOpen}
        />
    </Modal.Content>
);

export default ModalEditProject;

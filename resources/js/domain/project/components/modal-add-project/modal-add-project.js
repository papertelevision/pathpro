/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormAddProject from '@app/domain/project/components/form-add-project/form-add-project';

const ModalAddProject = ({ closeModal, setIsFormChanged }) => (
    <Modal.Content>
        <FormAddProject
            closeModal={closeModal}
            setIsFormChanged={setIsFormChanged}
        />
    </Modal.Content>
);

export default ModalAddProject;

/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormEditReleaseNotes from '@app/domain/release-note/components/form-edit-release-notes/form-edit-release-notes';

const ModalEditReleaseNote = ({
    releaseNote,
    projectData,
    currentTablePage,
    closeModal,
    setIsFormChanged,
    setIsEditReleaseNoteModalOpen,
}) => (
    <Modal.Content>
        <Modal.Header medium closeModal={closeModal}>
            <div className="modal__header-left">
                <div className="modal__header-title">
                    <strong>{projectData.title} | Edit Release Note</strong>
                </div>
            </div>
        </Modal.Header>
        <FormEditReleaseNotes
            closeModal={closeModal}
            setIsFormChanged={setIsFormChanged}
            setIsEditReleaseNoteModalOpen={setIsEditReleaseNoteModalOpen}
            releaseNote={releaseNote}
            currentTablePage={currentTablePage}
        />
    </Modal.Content>
);

export default ModalEditReleaseNote;

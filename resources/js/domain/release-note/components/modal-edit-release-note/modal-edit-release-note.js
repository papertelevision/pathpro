/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import FormEditReleaseNotes from '@app/domain/release-note/components/form-edit-release-notes/form-edit-release-notes';

const ModalEditReleaseNote = ({
    releaseNote,
    projectData,
    currentTablePage,
    closeModal,
    setIsFormChanged,
    setIsEditReleaseNoteModalOpen,
}) => (
    <FormEditReleaseNotes
        closeModal={closeModal}
        setIsFormChanged={setIsFormChanged}
        setIsEditReleaseNoteModalOpen={setIsEditReleaseNoteModalOpen}
        releaseNote={releaseNote}
        currentTablePage={currentTablePage}
    />
);

export default ModalEditReleaseNote;

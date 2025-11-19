/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import FormEditNewsUpdate from '@app/domain/news/components/form-edit-news-update/form-edit-news-update';

const ModalEditNewsUpdate = ({
    newsUpdate,
    project,
    closeModal,
    setIsFormChanged,
    setIsEditNewsUpdateModalOpen,
    currentTablePage,
}) => (
    <FormEditNewsUpdate
        closeModal={closeModal}
        setIsFormChanged={setIsFormChanged}
        setIsEditNewsUpdateModalOpen={setIsEditNewsUpdateModalOpen}
        newsUpdate={newsUpdate}
        currentTablePage={currentTablePage}
    />
);

export default ModalEditNewsUpdate;

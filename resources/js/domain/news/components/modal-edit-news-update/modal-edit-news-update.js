/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormEditNewsUpdate from '@app/domain/news/components/form-edit-news-update/form-edit-news-update';
import { dateFormat } from '@app/lib/date-format';

const ModalEditNewsUpdate = ({
    newsUpdate,
    project,
    closeModal,
    setIsFormChanged,
    setIsEditNewsUpdateModalOpen,
    currentTablePage,
}) => (
    <Modal.Content>
        <Modal.Header medium closeModal={closeModal}>
            <div className="modal__header-left">
                <div className="modal__header-title">
                    <strong>{project.title} | Edit News Update | </strong>
                    <strong>Updated: </strong>
                    <span>
                        {dateFormat(
                            newsUpdate.updated_at,
                            project.date_format,
                            false,
                            true
                        )}{' '}
                        |{' '}
                    </span>
                    <strong>Author: </strong>
                    <span>@{project.creator.username}</span>
                </div>
            </div>
        </Modal.Header>
        <FormEditNewsUpdate
            closeModal={closeModal}
            setIsFormChanged={setIsFormChanged}
            setIsEditNewsUpdateModalOpen={setIsEditNewsUpdateModalOpen}
            newsUpdate={newsUpdate}
            currentTablePage={currentTablePage}
        />
    </Modal.Content>
);

export default ModalEditNewsUpdate;

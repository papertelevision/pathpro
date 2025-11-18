/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormEditSubtask from '@app/domain/task/components/form-edit-subtask/form-edit-subtask';
import useTaskCommentsShowQuery from '@app/data/task/use-task-comments-show-query';
import FormEditSubtaskPublicView from '@app/domain/task/components/form-edit-subtask/form-edit-subtask-public-view';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const ModalEditSubtask = ({
    types,
    subtask,
    statuses,
    projectData,
    taskGroup,
    isModalOpen,
    setIsFormChanged,
    closeEditSubtaskModal,
    setIsEditSubtaskModalOpen,
}) => {
    const [sortCommentsBy, setSortCommentsBy] = useState();

    const { data: taskCommentsData, isLoading: isTaskCommentsDataLoading } =
        useTaskCommentsShowQuery(sortCommentsBy, subtask.id, {
            enabled: isModalOpen,
        });

    const { canCreateEditTasksFeatures, isUserLoggedIn } =
        usePermissionsContextApi();

    if (isTaskCommentsDataLoading) {
        return null;
    }

    return (
        <Modal.Content>
            {isUserLoggedIn && canCreateEditTasksFeatures(projectData.id) ? (
                <FormEditSubtask
                    subtask={subtask}
                    projectData={projectData}
                    taskTypesData={types}
                    taskStatusesData={statuses}
                    taskCommentsData={taskCommentsData}
                    sortCommentsBy={sortCommentsBy}
                    setSortCommentsBy={setSortCommentsBy}
                    closeModal={closeEditSubtaskModal}
                    setIsFormChanged={setIsFormChanged}
                    setIsEditSubtaskModalOpen={setIsEditSubtaskModalOpen}
                />
            ) : (
                <FormEditSubtaskPublicView
                    subtask={subtask}
                    taskGroup={taskGroup}
                    project={projectData}
                    taskCommentsData={taskCommentsData}
                    sortCommentsBy={sortCommentsBy}
                    setSortCommentsBy={setSortCommentsBy}
                    closeModal={closeEditSubtaskModal}
                />
            )}
        </Modal.Content>
    );
};

export default ModalEditSubtask;

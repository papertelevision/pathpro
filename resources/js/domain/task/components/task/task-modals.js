/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormEditTask from '@app/domain/task/components/form-edit-task/form-edit-task';
import FormAddSubTask from '@app/domain/task/components/form-add-subtask/form-add-subtask';

const TaskModals = ({
    task,
    types,
    groups,
    statuses,
    isEditTaskModalOpen,
    setIsEditTaskModalOpen,
    setOpenAlertBox,
    openAlertBox,
    closeEditTaskModal,
    projectData,
    setIsFormChanged,
    taskPopularity,
    idxPopularityTask,
    tasksSortedByUpvotes,
    isAddSubTaskModalOpen,
    setIsAddSubTaskModalOpen,
    closeAddTaskModal,
    urlAddress,
}) => {
    const [sortCommentsBy, setSortCommentsBy] = useState();

    return (
        <>
            <Modal
                className="full-height"
                modalIsOpen={isEditTaskModalOpen}
                setIsModalOpen={setIsEditTaskModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeEditTaskModal}
                urlAddress={urlAddress}
            >
                <Modal.Content>
                    {isEditTaskModalOpen && (
                        <FormEditTask
                            task={task}
                            types={types}
                            statuses={statuses}
                            projectData={projectData}
                            projectTaskGroups={groups}
                            setSortCommentsBy={setSortCommentsBy}
                            sortCommentsBy={sortCommentsBy}
                            closeModal={closeEditTaskModal}
                            setIsFormChanged={setIsFormChanged}
                            setIsEditTaskModalOpen={setIsEditTaskModalOpen}
                            taskPopularity={taskPopularity}
                            idxPopularity={idxPopularityTask}
                            tasksCount={tasksSortedByUpvotes.length}
                        />
                    )}
                </Modal.Content>
            </Modal>

            <Modal
                className="full-height"
                modalIsOpen={isAddSubTaskModalOpen}
                setIsModalOpen={setIsAddSubTaskModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeAddTaskModal}
            >
                <Modal.Content>
                    <FormAddSubTask
                        parentTaskData={task}
                        project={projectData}
                        types={types}
                        statuses={statuses}
                        closeModal={closeAddTaskModal}
                        setIsFormChanged={setIsFormChanged}
                        setIsAddSubTaskModalOpen={setIsAddSubTaskModalOpen}
                    />
                </Modal.Content>
            </Modal>
        </>
    );
};

export default TaskModals;

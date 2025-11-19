/**
 * External dependencies
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { NavLink } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/**
 * Internal dependencies
 */
import AccordionSection from '@app/components/accordion/accordion-section';
import AccordionHeader from '@app/components/accordion/accordion-header';
import AccordionBody from '@app/components/accordion/accordion-body';
import AccordionFooter from '@app/components/accordion/accordion-footer';
import TaskFooter from '@app/domain/task/components/task/task-footer';
import Modal from '@app/components/modal/modal';
import ModalEditSubtask from '@app/domain/task/components/modal-edit-subtask/modal-edit-subtask';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const TaskSubtask = ({
    idx,
    types,
    statuses,
    subtask,
    subtasks,
    taskGroup,
    projectData,
}) => {
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isEditSubtaskModalOpen, setIsEditSubtaskModalOpen] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const { canCreateEditTasksFeatures } = usePermissionsContextApi();

    const { taskId } = useParams();
    const navigate = useNavigate();

    const idxPopularity = subtasks
        .sort((item1, item2) => item2.upvotes_count - item1.upvotes_count)
        .findIndex((item) => subtask.id === item.id);
    const popularity =
        idxPopularity < 3 ? new Array(3 - idxPopularity).fill(0) : [];

    const closeEditSubtaskModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsEditSubtaskModalOpen(false);
            navigate(`/`);
        }
    };

    useEffect(() => {
        parseInt(taskId) === subtask.id
            ? setIsEditSubtaskModalOpen(true)
            : setIsEditSubtaskModalOpen(false);
    }, [taskId]);

    return (
        <Fragment>
            <Draggable
                key={subtask.id}
                draggableId={`subtask-${subtask.id}`}
                index={idx}
            >
                {(provided, _) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                        <AccordionSection index={idx}>
                            <AccordionHeader
                                showActionButtons={canCreateEditTasksFeatures(
                                    projectData.id
                                )}
                                handleAction={() =>
                                    navigate(`/task/${subtask.id}`)
                                }
                                DragAndDropProvided={provided}
                            >
                                <AccordionHeader.Left>
                                    <span
                                        className="box__task-status"
                                        style={{
                                            background: `${subtask.task_type.color}`,
                                        }}
                                        data-tooltip-id="tooltip"
                                        data-tooltip-content={
                                            subtask.task_type.title
                                        }
                                        data-tooltip-float
                                        data-tooltip-variant="light"
                                        data-tooltip-place="bottom"
                                    />
                                    <div className="box__header-left__text">
                                        <em>
                                            <NavLink to={`/task/${subtask.id}`}>
                                                {subtask.title}
                                            </NavLink>
                                        </em>
                                    </div>
                                </AccordionHeader.Left>
                            </AccordionHeader>
                            {subtask.description && subtask.description.replace(/<[^>]*>/g, '').trim() ? (
                                <AccordionBody index={idx}>
                                    {subtask.task_status.title === 'Complete' ? (
                                        <span>{subtask.task_status.title}</span>
                                    ) : (
                                        <i>{subtask.task_status.title}</i>
                                    )}
                                    <div className="accordion__body-wrapper__text">
                                        {parse(
                                            DOMPurify.sanitize(
                                                subtask.description,
                                                { ADD_ATTR: ['target'] }
                                            )
                                        )}
                                    </div>
                                </AccordionBody>
                            ) : (
                                <div style={{ margin: '5px 0 0', padding: '11px 0 0', borderTop: '1px solid #e6e6e6' }}></div>
                            )}
                            <AccordionFooter>
                                <TaskFooter
                                    task={subtask}
                                    project={projectData}
                                    taskPopularity={popularity}
                                />
                            </AccordionFooter>
                        </AccordionSection>
                    </div>
                )}
            </Draggable>

            <Modal
                className="full-height"
                modalIsOpen={isEditSubtaskModalOpen}
                setIsModalOpen={setIsEditSubtaskModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeEditSubtaskModal}
                urlAddress={`/`}
            >
                <ModalEditSubtask
                    types={types}
                    subtask={subtask}
                    statuses={statuses}
                    taskGroup={taskGroup}
                    projectData={projectData}
                    isModalOpen={isEditSubtaskModalOpen}
                    setIsFormChanged={setIsFormChanged}
                    closeEditSubtaskModal={closeEditSubtaskModal}
                    setIsEditSubtaskModalOpen={setIsEditSubtaskModalOpen}
                />
            </Modal>
        </Fragment>
    );
};

export default TaskSubtask;

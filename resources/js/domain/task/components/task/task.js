/**
 * External dependencies
 */
import React, { Fragment, useState, useEffect } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useParams, useNavigate, useLocation } from 'react-router';
import qs from 'qs';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import TaskHeader from '@app/domain/task/components/task/task-header';
import TaskFooter from '@app/domain/task/components/task/task-footer';
import Box from '@app/components/box/box';
import BoxContent from '@app/components/box/box-content';
import BoxButton from '@app/components/box/box-button';
import Accordion from '@app/components/accordion/accordion';
import TaskSubtask from '@app/domain/task/components/task/task-subtask';
import TaskModals from '@app/domain/task/components/task/task-modals';
import Icon from '@app/components/icon/icon';
import { StrictModeDroppable } from '@app/lib/strict-mode-droppable';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import useTasksSubtasksOrderUpdateMutation from '@app/data/task/use-tasks-subtasks-order-update-mutation';

const Task = ({
    idx,
    task,
    types,
    groups,
    project,
    statuses,
    isVisible,
    tasksSortedByUpvotes,
}) => {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isAddSubTaskModalOpen, setIsAddSubTaskModalOpen] = useState(false);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const navigate = useNavigate();
    const { taskId } = useParams();
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { canCreateEditTasksFeatures } = usePermissionsContextApi();

    const { mutate: mutateTasksSubtasksOrderUpdate } =
        useTasksSubtasksOrderUpdateMutation(project.id, queryArgs);

    const idxPopularityTask = tasksSortedByUpvotes.findIndex(
        (item) => task.id === item.id
    );
    const taskPopularity =
        idxPopularityTask < 3 ? new Array(3 - idxPopularityTask).fill(0) : [];

    const closeAddTaskModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsAddSubTaskModalOpen(false);
        }
    };

    const closeEditTaskModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsEditTaskModalOpen(false);
            navigate(`/`);
        }
    };

    const handleShowSubtasks = () => {
        setShowSubtasks(!showSubtasks);
    };

    const onDragSubtaskEnd = ({ destination, source, draggableId }) => {
        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        handleMoveSubTasks(destination, source);
    };

    const handleMoveSubTasks = (destination, source) => {
        const draggedSubtask = task?.subtasks[source.index];

        task?.subtasks.splice(source.index, 1);
        task?.subtasks.splice(destination.index, 0, draggedSubtask);

        const orderedData = task?.subtasks.map((item, idx) => {
            item.order = idx;
            return { id: item.id, order: item.order, title: item.title };
        });

        mutateTasksSubtasksOrderUpdate(orderedData);
    };

    useEffect(() => {
        parseInt(taskId) === task.id
            ? setIsEditTaskModalOpen(true)
            : setIsEditTaskModalOpen(false);
    }, [taskId]);

    return (
        <Fragment>
            <Draggable
                key={task.id}
                draggableId={`task-${task.id}`}
                index={idx}
            >
                {(provided, _) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={classNames('group__task', {
                            'is-visible': isVisible,
                        })}
                    >
                        <Box
                            modifier="task"
                            isColored={
                                task.are_subtasks_allowed &&
                                task.task_type.color
                            }
                            data-tooltip-id="tooltip"
                            data-tooltip-content={task.task_type.title}
                            data-tooltip-place="bottom"
                            data-tooltip-variant="light"
                        >
                            <div
                                className={classNames('box__container', {
                                    'is-colored':
                                        task.are_subtasks_allowed &&
                                        task.task_type.color,
                                })}
                            >
                                <TaskHeader
                                    task={task}
                                    provided={provided}
                                    multiTasks={task.are_subtasks_allowed}
                                    taskPopularity={taskPopularity}
                                />
                                <BoxContent>
                                    <div className="box__content-text">
                                        {parse(
                                            DOMPurify.sanitize(
                                                task.description,
                                                { ADD_ATTR: ['target'] }
                                            )
                                        )}
                                    </div>
                                </BoxContent>
                                <TaskFooter
                                    task={task}
                                    project={project}
                                    taskPopularity={taskPopularity}
                                />

                                {task.are_subtasks_allowed && (
                                    <Fragment>
                                        {!showSubtasks ? (
                                            <div className="box__actions is-centered">
                                                <BoxButton
                                                    unborderless
                                                    onClick={handleShowSubtasks}
                                                >
                                                    <span>Show subtasks</span>
                                                    <Icon type="dropdown" />
                                                </BoxButton>
                                            </div>
                                        ) : (
                                            <div className="box__actions">
                                                {canCreateEditTasksFeatures(
                                                    project.id
                                                ) &&
                                                task.are_subtasks_allowed ? (
                                                    <BoxButton
                                                        unborderless
                                                        icon
                                                        onClick={() =>
                                                            setIsAddSubTaskModalOpen(
                                                                true
                                                            )
                                                        }
                                                    >
                                                        + Add Subtask
                                                    </BoxButton>
                                                ) : (
                                                    <div></div>
                                                )}
                                                {task.subtasks.length > 0 && (
                                                    <BoxButton
                                                        unborderless
                                                        onClick={
                                                            handleShowSubtasks
                                                        }
                                                    >
                                                        <span>
                                                            Hide subtasks
                                                        </span>
                                                        <div className="box__hide-subtasks">
                                                            <Icon type="dropdown" />
                                                        </div>
                                                    </BoxButton>
                                                )}
                                            </div>
                                        )}
                                    </Fragment>
                                )}
                            </div>
                            <DragDropContext onDragEnd={onDragSubtaskEnd}>
                                <StrictModeDroppable
                                    droppableId={`droppable-subtask-${task.id}`}
                                >
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                        >
                                            {task.are_subtasks_allowed !==
                                                0 && (
                                                <Accordion
                                                    active={showSubtasks}
                                                    modifier="subtask"
                                                >
                                                    {task.subtasks.map(
                                                        (item, idx) => (
                                                            <TaskSubtask
                                                                key={idx}
                                                                idx={idx}
                                                                types={types}
                                                                subtask={item}
                                                                statuses={
                                                                    statuses
                                                                }
                                                                subtasks={
                                                                    task.subtasks
                                                                }
                                                                taskGroup={
                                                                    task.task_group
                                                                }
                                                                projectData={
                                                                    project
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Accordion>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </StrictModeDroppable>
                            </DragDropContext>
                        </Box>
                    </div>
                )}
            </Draggable>

            <TaskModals
                task={task}
                types={types}
                groups={groups}
                statuses={statuses}
                projectData={project}
                isEditTaskModalOpen={isEditTaskModalOpen}
                setIsEditTaskModalOpen={setIsEditTaskModalOpen}
                setOpenAlertBox={setOpenAlertBox}
                openAlertBox={openAlertBox}
                closeEditTaskModal={closeEditTaskModal}
                setIsFormChanged={setIsFormChanged}
                taskPopularity={taskPopularity}
                idxPopularityTask={idxPopularityTask}
                tasksSortedByUpvotes={tasksSortedByUpvotes}
                isAddSubTaskModalOpen={isAddSubTaskModalOpen}
                setIsAddSubTaskModalOpen={setIsAddSubTaskModalOpen}
                closeAddTaskModal={closeAddTaskModal}
                urlAddress={`/`}
            />
        </Fragment>
    );
};

export default Task;

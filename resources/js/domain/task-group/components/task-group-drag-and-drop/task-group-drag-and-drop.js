/**
 * External dependencies
 */
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useLocation } from 'react-router';
import qs from 'qs';

/**
 * Internal dependencies
 */
import { StrictModeDroppable } from '@app/lib/strict-mode-droppable';
import TaskGroup from '@app/domain/task-group/components/task-group/task-group';
import useTaskGroupsOrderUpdateMutation from '@app/data/task-group/use-task-groups-order-update-mutation';
import useTasksOrderUpdateMutation from '@app/data/task/use-tasks-order-update-mutation';

const TaskGroupDragAndDrop = ({
    types,
    groups,
    project,
    statuses,
    filterValue,
}) => {
    const [areTasksFiltered, setAreTasksFiltered] = useState(false);

    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { mutate: mutateTaskGroupsOrderUpdate } =
        useTaskGroupsOrderUpdateMutation(project.slug, queryArgs);
    const { mutate: mutateTasksOrderUpdate } = useTasksOrderUpdateMutation(
        project.slug,
        queryArgs
    );

    const onDragEnd = ({ destination, source, draggableId }) => {
        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (draggableId.includes('group')) {
            handleMoveTaskGroups(destination, source);
        } else {
            handleMoveTasks(destination, source);
        }
    };

    const handleMoveTaskGroups = (destination, source) => {
        const draggedTaskGroup = groups[source.index];

        groups.splice(source.index, 1);
        groups.splice(destination.index, 0, draggedTaskGroup);

        const orderedData = groups.map((item, idx) => {
            item.order = idx;
            return { id: item.id, order: item.order };
        });

        mutateTaskGroupsOrderUpdate(orderedData);
    };

    const handleMoveTasks = (destination, source) => {
        const sourceGroupId = parseInt(source.droppableId.match(/\d+/));
        const newGroupId = parseInt(destination.droppableId.match(/\d+/));

        const sourceGroup = getTasksGroup(sourceGroupId);

        const destinationGroup = getTasksGroup(newGroupId);

        const draggedTask = sourceGroup.tasks[source.index];

        if (sourceGroupId === newGroupId) {
            if (
                areTasksFiltered.status &&
                areTasksFiltered.group === sourceGroupId
            ) {
                var buff = destinationGroup.tasks[source.index];
                destinationGroup.tasks[source.index] =
                    destinationGroup.tasks[destination.index];
                destinationGroup.tasks[destination.index] = buff;
            } else {
                destinationGroup.tasks.splice(source.index, 1);
                destinationGroup.tasks.splice(
                    destination.index,
                    0,
                    draggedTask
                );
            }

            const mutationData = [
                destinationGroup.tasks.map((item, idx) => ({
                    id: item.id,
                    order: idx,
                    task_group_id: newGroupId,
                })),
            ];

            mutateTasksOrderUpdate(mutationData, {
                onSuccess: () => {
                    setAreTasksFiltered(false);
                },
            });
        } else {
            sourceGroup.tasks.splice(source.index, 1);
            destinationGroup.tasks.splice(destination.index, 0, draggedTask);

            const mutationData = [
                sourceGroup.tasks.map((item, idx) => ({
                    id: item.id,
                    order: idx,
                    task_group_id: sourceGroupId,
                })),
                destinationGroup.tasks.map((item, idx) => ({
                    id: item.id,
                    order: idx,
                    task_group_id: newGroupId,
                })),
            ];

            mutateTasksOrderUpdate(mutationData, {
                onSuccess: () => {
                    setAreTasksFiltered(false);
                },
            });
        }
    };

    const getTasksGroup = (groupTypeId) => {
        return groups.find((item) => {
            if (item.id === groupTypeId) {
                return item.tasks;
            }
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable
                droppableId={`droppable-group-${project.id}`}
                direction="horizontal"
                type="column"
            >
                {(provided) => (
                    <div className="groups__container" ref={provided.innerRef}>
                        {groups.map((item, idx) => (
                            <TaskGroup
                                idx={idx}
                                key={item.id}
                                types={types}
                                groups={groups}
                                project={project}
                                statuses={statuses}
                                provided={provided}
                                taskGroup={item}
                                setAreTasksFiltered={setAreTasksFiltered}
                                isVisible={
                                    !filterValue ||
                                    item.visibility === filterValue
                                }
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </StrictModeDroppable>
        </DragDropContext>
    );
};

export default TaskGroupDragAndDrop;

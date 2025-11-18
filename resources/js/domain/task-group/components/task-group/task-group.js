/**
 * External dependencies
 */
import React, { useState, Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Group from '@app/components/group/group';
import GroupHeader from '@app/components/group/group-header';
import GroupHeaderIcon from '@app/components/group/group-header-icon';
import GroupHeaderTitle from '@app/components/group/group-header-title';
import ButtonIcon from '@app/components/button/button-icon';
import Progressbar from '@app/components/progressbar/progressbar';
import BoxButton from '@app/components/box/box-button';
import Task from '@app/domain/task/components/task/task';
import Modal from '@app/components/modal/modal';
import FormAddTask from '@app/domain/task/components/form-add-task/form-add-task';
import FormEditTaskGroup from '@app/domain/task-group/components/form-edit-task-group/form-edit-task-group';
import Filter from '@app/components/filter/filter';
import addTask from '@/images/add_task.png';
import { StrictModeDroppable } from '@app/lib/strict-mode-droppable';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { dateFormat } from '@app/lib/date-format';

const TaskGroup = ({
    idx,
    types,
    groups,
    project,
    statuses,
    taskGroup,
    isVisible,
    setAreTasksFiltered,
}) => {
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isEditTaskGroupModalOpen, setIsEditTaskGroupModalOpen] =
        useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [visibilitiesFilterValue, setVisibilitiesFilterValue] = useState();
    const [typesFilterValue, setTypesFilterValue] = useState();

    const { taskGroupVisibilities: visibilities } = useQueryContextApi();
    const {
        canCreateEditTaskGroups,
        canCreateEditTasksFeatures,
        isAuthUserAdmitOrTeamMember,
    } = usePermissionsContextApi();

    const closeAddTaskModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsAddTaskModalOpen(false);
        }
    };

    const closeEditTaskGroupModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsEditTaskGroupModalOpen(false);
        }
    };

    const tasksSortedByUpvotes = Object.values(groups)
        .map((item) => {
            return item.tasks;
        })
        .flat(1)
        .sort((item1, item2) => item2.upvotes_count - item1.upvotes_count);

    const plannedReleaseDateFormat = () => {
        if (taskGroup.planned_release_type === 'Single Date') {
            return dateFormat(
                taskGroup.planned_release_end_date,
                project.date_format,
                false,
                false,
                '/'
            );
        } else {
            return `${moment(taskGroup.planned_release_start_date).format(
                'MMMM'
            )} / ${moment(taskGroup.planned_release_end_date).format('MMMM')}`;
        }
    };

    const typeFilterValues = types.filter((type) =>
        taskGroup.tasks.some(
            (task) =>
                task.task_type.id === type.id &&
                (!visibilitiesFilterValue ||
                    task.visibility === visibilitiesFilterValue)
        )
    );

    return (
        <Fragment>
            <Draggable
                key={taskGroup.id}
                draggableId={`group-${taskGroup.id}`}
                index={idx}
            >
                {(provided, _) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={classNames('group__draggable-container', {
                            'is-visible': isVisible,
                        })}
                    >
                        <Group modifier="task">
                            <GroupHeader color={taskGroup.header_color}>
                                <GroupHeader.Left
                                    description={taskGroup.description}
                                >
                                    <GroupHeaderIcon
                                        iconUrl={taskGroup.icon_url}
                                        predefinedIconType={taskGroup.icon_type}
                                        predefinedIconIdentifier={taskGroup.icon_identifier}
                                    />
                                    <GroupHeaderTitle>
                                        <span>{taskGroup.title}</span>
                                        {taskGroup.is_planned_release_date_include && (
                                            <i>
                                                Planned Release:{' '}
                                                {plannedReleaseDateFormat()}
                                            </i>
                                        )}
                                    </GroupHeaderTitle>
                                </GroupHeader.Left>
                                <GroupHeader.Right>
                                    {isAuthUserAdmitOrTeamMember(
                                        project.id
                                    ) && (
                                        <Filter
                                            tooltipText="Filter task visibility"
                                            type="visibility"
                                            data={visibilities}
                                            filterValue={
                                                visibilitiesFilterValue
                                            }
                                            setFilterValue={
                                                setVisibilitiesFilterValue
                                            }
                                            showWhiteImg
                                        />
                                    )}
                                    {typeFilterValues.length > 0 && (
                                        <Filter
                                            tooltipText="Filter task type"
                                            type="type"
                                            data={typeFilterValues}
                                            filterValue={typesFilterValue}
                                            setFilterValue={setTypesFilterValue}
                                            onChange={(value) =>
                                                setAreTasksFiltered({
                                                    status: !!value,
                                                    group: taskGroup.id,
                                                })
                                            }
                                        />
                                    )}
                                    {canCreateEditTaskGroups(project.id) && (
                                        <ButtonIcon
                                            iconType="simple_pencil"
                                            onClick={() =>
                                                setIsEditTaskGroupModalOpen(
                                                    true
                                                )
                                            }
                                        />
                                    )}
                                    {canCreateEditTaskGroups(project.id) && (
                                        <div {...provided.dragHandleProps}>
                                            <ButtonIcon iconType="dragdrop" />
                                        </div>
                                    )}
                                </GroupHeader.Right>
                            </GroupHeader>
                            {taskGroup.is_percentage_complete_visible && (
                                <div className="group__subheader">
                                    <Progressbar
                                        color={taskGroup.header_color}
                                        value={taskGroup.percentage_complete}
                                        displayPercentageComplete
                                    />
                                </div>
                            )}
                            <StrictModeDroppable
                                droppableId={`droppable-task-${taskGroup.id}`}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        className="group__tasks"
                                    >
                                        {taskGroup.tasks.map((item, idx) => (
                                            <Task
                                                key={item.id}
                                                idx={idx}
                                                task={item}
                                                types={types}
                                                project={project}
                                                statuses={statuses}
                                                provided={provided}
                                                tasksSortedByUpvotes={
                                                    tasksSortedByUpvotes
                                                }
                                                groups={groups}
                                                isVisible={
                                                    (!typesFilterValue ||
                                                        typesFilterValue ===
                                                            item.task_type
                                                                .id) &&
                                                    (!visibilitiesFilterValue ||
                                                        visibilitiesFilterValue ===
                                                            item.visibility)
                                                }
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </StrictModeDroppable>
                            {canCreateEditTasksFeatures(project.id) && (
                                <div className="group__actions">
                                    <BoxButton
                                        add
                                        color="gray"
                                        onClick={() =>
                                            setIsAddTaskModalOpen(true)
                                        }
                                    >
                                        <img src={addTask} />
                                        Add Entry
                                    </BoxButton>
                                </div>
                            )}
                            <Modal
                                className="full-height"
                                modalIsOpen={isAddTaskModalOpen}
                                setIsModalOpen={setIsAddTaskModalOpen}
                                isAlertBoxActive={openAlertBox}
                                setOpenAlertBox={setOpenAlertBox}
                                closeModal={closeAddTaskModal}
                                disableOutsideClick
                            >
                                <Modal.Content>
                                    <FormAddTask
                                        types={types}
                                        project={project}
                                        statuses={statuses}
                                        taskGroupID={taskGroup.id}
                                        closeModal={closeAddTaskModal}
                                        setIsFormChanged={setIsFormChanged}
                                        setIsAddTaskModalOpen={
                                            setIsAddTaskModalOpen
                                        }
                                    />
                                </Modal.Content>
                            </Modal>
                        </Group>
                    </div>
                )}
            </Draggable>
            <Modal
                className="full-height"
                modalIsOpen={isEditTaskGroupModalOpen}
                setIsModalOpen={setIsEditTaskGroupModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeEditTaskGroupModal}
            >
                <Modal.Content>
                    <FormEditTaskGroup
                        project={project}
                        taskGroup={taskGroup}
                        statuses={statuses}
                        closeModal={closeEditTaskGroupModal}
                        setIsFormChanged={setIsFormChanged}
                        setIsEditTaskGroupModalOpen={
                            setIsEditTaskGroupModalOpen
                        }
                    />
                </Modal.Content>
            </Modal>
        </Fragment>
    );
};

export default TaskGroup;

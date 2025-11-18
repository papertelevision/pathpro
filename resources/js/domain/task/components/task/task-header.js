/**
 * External dependencies
 */
import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router';

/**
 * Internal dependencies
 */
import BoxHeader from '@app/components/box/box-header';
import ButtonIcon from '@app/components/button/button-icon';
import Icon from '@app/components/icon/icon';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TaskHeader = ({ task, provided, multiTasks, taskPopularity }) => {
    const navigate = useNavigate();
    const { canCreateEditTasksFeatures } = usePermissionsContextApi();

    return (
        <Fragment>
            <BoxHeader>
                <BoxHeader.Left>
                    {multiTasks ? (
                        <Icon
                            type="multi_tasks"
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Includes multiple subtasks"
                            data-tooltip-float
                            data-tooltip-variant="light"
                            data-tooltip-place="bottom"
                        />
                    ) : (
                        <div
                            className="box__task-status"
                            style={{
                                background: `${task.task_type.color}`,
                            }}
                            data-tooltip-id="tooltip"
                            data-tooltip-content={task.task_type.title}
                            data-tooltip-float
                            data-tooltip-variant="light"
                            data-tooltip-place="bottom"
                        />
                    )}
                    <div className="box__header-left__text">
                        <strong>
                            <NavLink to={`/task/${task.id}`}>
                                {task.title}
                            </NavLink>
                        </strong>
                        {task.task_status.title === 'Complete' ? (
                            <span>{task.task_status.title}</span>
                        ) : (
                            <i>{task.task_status.title}</i>
                        )}
                    </div>
                </BoxHeader.Left>
                <BoxHeader.Right>
                    {task.are_stats_public && taskPopularity && taskPopularity.length > 0 && (
                        <Icon
                            type="popularity"
                            className="popularity"
                            data-tooltip-id="tooltip"
                            data-tooltip-float
                            data-tooltip-variant="light"
                            data-tooltip-attr="popularity"
                        />
                    )}
                    {canCreateEditTasksFeatures(task.project_id) && (
                        <>
                            <ButtonIcon
                                to={`/task/${task.id}`}
                                iconType="simple_pencil"
                                color="lighter-gray"
                            />
                            <div {...provided.dragHandleProps}>
                                <ButtonIcon iconType="dragdrop" color="gray" />
                            </div>
                        </>
                    )}
                </BoxHeader.Right>
            </BoxHeader>
        </Fragment>
    );
};

export default TaskHeader;

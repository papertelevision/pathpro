/**
 * External dependencies
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router';
import { debounce } from 'lodash';
import qs from 'qs';

/**
 * Internal dependencies
 */
import BoxFooter from '@app/components/box/box-footer';
import Icon from '@app/components/icon/icon';
import BoxButton from '@app/components/box/box-button';
import Dots from '@app/components/dots/dots';
import StaffAssigned from '@/images/staff_assigned@2x.png';
import SillyFace from '@/images/icon_community.png';
import BoxButtonShare from '@app/components/box/box-button-share';
import BoxButtonUpvote from '@app/components/box/box-button-upvote';
import useSubscriptionStoreMutation from '@app/data/subscription/use-subscription-store-mutation';
import useSubscriptionDestroyMutation from '@app/data/subscription/use-subscription-destroy-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const TaskFooter = ({ task, project, taskPopularity }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    const { authUser, isUserLoggedIn } = usePermissionsContextApi();

    const subscriptionId = task?.subscribers.find(
        (item) => item.user_id === authUser?.id
    )?.id;

    const { mutate: mutateSubscriptionStore } = useSubscriptionStoreMutation(
        projectSlug,
        queryArgs
    );
    const { mutate: mutateSubscriptionDestroy } =
        useSubscriptionDestroyMutation(projectSlug, queryArgs);

    const handleNotificationButtonClick = () =>
        subscriptionId
            ? mutateSubscriptionDestroy(subscriptionId)
            : mutateSubscriptionStore({
                  subscribable_id: task.id,
                  subscribable_type: 'task',
              });

    return (
        <BoxFooter>
            <BoxFooter.Left>
                {task.comments_count > 0 && task.are_comments_enabled && (
                    <NavLink
                        to={`/task/${task.id}`}
                        className="box__footer-comments-wrapper"
                        data-tooltip-id="tooltip"
                        data-tooltip-float
                        data-tooltip-variant="light"
                        data-tooltip-content={`${task.comments_count} suggestions have been made by community members for this feature/idea.`}
                    >
                        <Icon type="comments" />
                        <span className="box__footer-comments-count">
                            {task.comments_count}
                        </span>
                    </NavLink>
                )}

{((task.creator && task.is_creator_visible) || (task.team_members.length > 0 && task.are_team_members_visible)) && (
                    <div
                        className="task-avatars"
                        data-tooltip-id="tooltip"
                        data-tooltip-float
                        data-tooltip-variant="light"
                        data-tooltip-html={
                            (() => {
                                const creatorName = task.creator?.username || 'Unknown';
                                const teamMemberNames = task.are_team_members_visible && task.team_members.length > 0
                                    ? task.team_members.map(m => `<span style="color: #24bffa">@${m.username}</span>`).join(', ')
                                    : '';

                                const showCreator = task.is_creator_visible && task.creator;

                                if (showCreator && teamMemberNames) {
                                    return `Created by: <span style="color: #24bffa">@${creatorName}</span><br>Assigned to: ${teamMemberNames}`;
                                }
                                if (showCreator) {
                                    return `Created by: <span style="color: #24bffa">@${creatorName}</span>`;
                                }
                                if (teamMemberNames) {
                                    return `Assigned to: ${teamMemberNames}`;
                                }
                                return '';
                            })()
                        }
                    >
                        {task.creator && task.is_creator_visible && (
                            <div className="task-avatars__avatar">
                                {task.creator.avatar && !task.creator.avatar.includes('user-default-img.png') ? (
                                    <img
                                        src={task.creator.avatar}
                                        alt={task.creator.username}
                                        className="task-avatars__image"
                                    />
                                ) : (
                                    <div className="task-avatars__initials">
                                        {task.creator.username?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                )}
                            </div>
                        )}
                        {task.are_team_members_visible && task.team_members
                            .filter(member => member.id !== task.creator?.id)
                            .map((member, index) => (
                                <div key={member.id} className="task-avatars__avatar" style={{ zIndex: 10 - index }}>
                                    {member.avatar && !member.avatar.includes('user-default-img.png') ? (
                                        <img
                                            src={member.avatar}
                                            alt={member.username}
                                            className="task-avatars__image"
                                        />
                                    ) : (
                                        <div className="task-avatars__initials">
                                            {member.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                {task.community_members.length > 0 && (
                    <img
                        src={SillyFace}
                        alt="Silly Face"
                        width="24px"
                        height="24px"
                        data-tooltip-id="tooltip"
                        data-tooltip-float
                        data-tooltip-variant="light"
                        data-tooltip-html={`Suggested by: ${task.community_members.map(m => `<span style="color: #24bffa">@${m.username}</span>`).join(', ')}`}
                    />
                )}
            </BoxFooter.Left>

            <BoxFooter.Right>
                {isUserLoggedIn && (
                    <BoxButton
                        checked={subscriptionId}
                        onClick={debounce(
                            () => handleNotificationButtonClick(),
                            500
                        )}
                    >
                        <Icon type="notification" />
                    </BoxButton>
                )}

                <BoxButtonShare
                    shareUrl={`/task/${task.id}`}
                    shareObject="task"
                />

                {task.is_task_upvoting_enabled && (
                    <BoxButtonUpvote
                        project={project}
                        upvotable={task}
                        upvotableType="task"
                        showIcon={true}
                        iconOnly={true}
                        invalidateQueries={[
                            'projects/task-groups/index',
                            projectSlug,
                            queryArgs,
                        ]}
                    />
                )}

                <BoxButton
                    onClick={() => navigate(`/task/${task.id}`)}
                    data-tooltip-float
                    data-tooltip-id="tooltip"
                    data-tooltip-variant="light"
                    data-tooltip-place="bottom"
                    data-tooltip-attr="dotButton"
                >
                    <Dots />
                </BoxButton>
            </BoxFooter.Right>
        </BoxFooter>
    );
};

export default TaskFooter;

/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import AlertBox from '@app/components/alert-box/alert-box';
import ButtonDeny from '@app/components/button/button-deny';
import Icon from '@app/components/icon/icon';
import useProjectCommunityMemberDestroyMutation from '@app/data/project/use-project-community-member-destroy-mutation';
import { useQueryContextApi } from '@app/lib/query-context-api';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const AuthUserStats = () => {
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [wipeMemberContent, setWipeMemberContent] = useState(false);

    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();
    const { authUser, isAuthUserCommunityMember } = usePermissionsContextApi();
    const { selectedValue: projectSlug, setSelectedValue } =
        useHeaderSelectContext();
    const { projects } = useQueryContextApi();
    const { mutate: mutateUserDestroy } =
        useProjectCommunityMemberDestroyMutation(projectSlug, authUser.id);

    const handleDeleteCommunityMember = (e) => {
        mutateUserDestroy(
            {
                wipe_member_content: wipeMemberContent,
                ban_member: false,
            },
            {
                onSuccess: () => {
                    setSelectedValue();
                    setPopupNotificationText('You have left this project!');
                    setIsPopupNotificationVisible(true);
                    setOpenAlertBox(false);
                },
            }
        );
    };

    const project = projects.find((project) => project.slug === projectSlug);

    const rank = authUser.permissions.find(
        (permission) => permission.project.slug === projectSlug
    )?.rank_label;

    return (
        <div className="user-row-col-right">
            <div className="user-row-content">
                <div className="user-row-content-header">
                    <h3>
                        {project && isAuthUserCommunityMember(project.id) ? (
                            <>
                                Your Stats <i>| </i>{' '}
                                <strong>{project.title}</strong>
                            </>
                        ) : (
                            'You have not joined this project'
                        )}
                    </h3>
                </div>
                {project && isAuthUserCommunityMember(project.id) && (
                    <>
                        <ul className="user-row-content__list">
                            <li>
                                <div className="user-row-content__list-holder">
                                    <strong>{rank}</strong>
                                    <Icon
                                        type="quest_circle"
                                        data-tooltip-id="tooltip"
                                        data-tooltip-float
                                        data-tooltip-variant="light"
                                        data-tooltip-attr="rank"
                                        data-tooltip-place="top"
                                    />
                                </div>
                            </li>
                            <li>
                                <strong>Features / Ideas</strong>
                            </li>
                            <li className="is-colored">
                                <span>Submitted</span>
                                <span>{authUser.submissions_count}</span>
                            </li>
                            <li>
                                <span>Approved</span>
                                <span>
                                    {authUser.adopted_submissions_count}
                                </span>
                            </li>
                        </ul>
                        <ul className="user-row-content__list">
                            <li>
                                <strong>Community Involvement</strong>
                            </li>
                            <li className="is-colored">
                                <span>Suggestions / Comments Made</span>
                                <span>{authUser.comments_count}</span>
                            </li>
                            <li>
                                <span>Suggestions Highlighted by Admin</span>
                                <span>
                                    {authUser.highlighted_comments_count}
                                </span>
                            </li>
                            <li className="is-colored">
                                <span>Features / Ideas Upvoted</span>
                                <span>
                                    {authUser.features_and_tasks_upvoted_count}
                                </span>
                            </li>
                            <li>
                                <span>Comments Upvoted</span>
                                <span>{authUser.comments_upvoted}</span>
                            </li>
                        </ul>
                        <ul className="user-row-content__list">
                            <li className="user-row-content__list-actions">
                                <ButtonDeny
                                    block
                                    type="button"
                                    onClick={() => setOpenAlertBox(true)}
                                >
                                    <Icon type="deny" />
                                    Leave this Project
                                </ButtonDeny>
                            </li>
                        </ul>
                    </>
                )}
            </div>
            <AlertBox
                isActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                deleteAction={handleDeleteCommunityMember}
                message="Are you sure you want to leave this project?"
                additionalActions={[
                    {
                        title: 'Wipe content',
                        description:
                            'Checking this will fully remove all comments, upvotes, stats, and other details associated with this account, and cannot be undone!',
                        handler: (e) => setWipeMemberContent(e.target.checked),
                    },
                ]}
            />
        </div>
    );
};

export default AuthUserStats;

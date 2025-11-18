/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import ButtonDeny from '@app/components/button/button-deny';
import Icon from '@app/components/icon/icon';
import FormCheckbox from '@app/components/form/form-checkbox';
import FormSelect from '@app/components/form/form-select';
import Loader from '@app/components/loader/loader';
import useUserRanksIndexQuery from '@app/data/user/use-user-ranks-index-query';
import { useQueryContextApi } from '@app/lib/query-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const MemberProfileStats = ({
    isCommunityMember,
    member,
    setOpenAlertBox,
    setOpenUnBanAlertBox,
    disabled,
}) => {
    const { projects } = useQueryContextApi();

    const project = projects.find((project) => project.slug === projectSlug);
    const isMemberAssignedToSelectedProject = isCommunityMember
        ? project?.community_members.some((cm) => cm.id === member.id)
        : project?.team_members.some((cm) => cm.id === member.id);
    const isMemberBannedFromSelectedProject =
        project?.banned_community_members.some((cm) => cm.id === member.id);

    const { data: userRanksData, isLoading: isUserRanksDataLoading } =
        useUserRanksIndexQuery();

    if (isUserRanksDataLoading) {
        return <Loader white />;
    }

    return (
        <div className="user-row-content">
            <div className="user-row-content-header">
                <h3>
                    {!projectSlug || isMemberAssignedToSelectedProject ? (
                        <>
                            User Stats <i>| </i>
                            <strong>
                                {projectSlug ? project.title : 'All Projects'}
                            </strong>
                        </>
                    ) : isMemberBannedFromSelectedProject ? (
                        'This user is banned from this project'
                    ) : (
                        'This user is not associated with this project'
                    )}
                </h3>
            </div>
            {(!projectSlug || isMemberAssignedToSelectedProject) && (
                <>
                    <ul className="user-row-content__list">
                        {projectSlug && (
                            <li className="user-row-content__list-rank">
                                <FormSelect
                                    title="Rank/Role"
                                    id="rank"
                                    name="rank"
                                    selected={member.rank?.id}
                                    data={userRanksData}
                                />
                                <FormCheckbox
                                    id="is_rank_visible"
                                    name="is_rank_visible"
                                    description="Include rank in member description"
                                />
                            </li>
                        )}
                        <li>
                            <strong>Features / Ideas</strong>
                        </li>
                        <li className="is-colored">
                            <span>Submitted</span>
                            <span>{member.submissions_count}</span>
                        </li>
                        <li>
                            <span>Approved</span>
                            <span>{member.adopted_submissions_count}</span>
                        </li>
                    </ul>
                    <ul className="user-row-content__list">
                        <li>
                            <strong>Community Involvement</strong>
                        </li>
                        <li className="is-colored">
                            <span>Suggestions / Comments Made</span>
                            <span>{member.comments_count}</span>
                        </li>
                        <li>
                            <span>Suggestions Highlighted by Admin</span>
                            <span>{member.highlighted_comments_count}</span>
                        </li>
                        <li className="is-colored">
                            <span>Features / Ideas Upvoted</span>
                            <span>
                                {member.features_and_tasks_upvoted_count}
                            </span>
                        </li>
                        <li>
                            <span>Comments Upvoted</span>
                            <span>{member.comments_upvoted}</span>
                        </li>
                    </ul>
                </>
            )}
            {projectSlug &&
                (isMemberAssignedToSelectedProject ||
                    isMemberBannedFromSelectedProject) && (
                    <ul className="user-row-content__list">
                        <li className="user-row-content__list-actions">
                            {isMemberAssignedToSelectedProject && (
                                <ButtonDeny
                                    block
                                    type="button"
                                    onClick={() => setOpenAlertBox(true)}
                                    disabled={disabled}
                                >
                                    <Icon type="deny" />
                                    Remove Member's Access to This Project
                                </ButtonDeny>
                            )}
                            {isMemberBannedFromSelectedProject && (
                                <ButtonDeny
                                    block
                                    type="button"
                                    color="green"
                                    onClick={() => setOpenUnBanAlertBox(true)}
                                    disabled={disabled}
                                >
                                    <Icon type="check_mark" />
                                    Admit Access to This Project
                                </ButtonDeny>
                            )}
                        </li>
                    </ul>
                )}
        </div>
    );
};

export default MemberProfileStats;

/**
 * External dependencies
 */
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Internal dependencies
 */
import { useDomain, useSubdomain } from '@app/lib/domain';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const teamPages = ['community-members', 'team-members', 'banned-members'];

const TooltipUserAvatar = ({ user, isUsernameVisible = true, projectSlug }) => {
    let location = useLocation();
    const currentPathname = location.pathname;
    const { isUserLoggedIn, authUser, canUpdateProject } =
        usePermissionsContextApi();

    const dataTooltipHtml = `<div class="react-tooltip--user"><span>@${
        user.username
    }</span> ${
        user.rank?.id && user?.rank?.is_rank_visible
            ? `| <span>${user.rank?.label}</span>`
            : ''
    } <p>${user.biography}</p></div>`;

    const getUserLink = () => {
        user.id === authUser.id && '/account';

        const page = user?.is_banned
            ? 'banned-members'
            : user.rank?.role === 'Community Member'
            ? 'community-members'
            : 'team-members';

        return projectSlug
            ? useSubdomain(projectSlug, `${page}/${user.id}`)
            : useDomain(`${page}/${user.id}`);
    };

    const hasCustomAvatar = user.avatar && !user.avatar.includes('user-default-img.png');

    const avatarContent = hasCustomAvatar ? (
        <img
            src={user.avatar}
            alt="User Avatar"
            data-tooltip-id={user.biography ? "tooltip" : undefined}
            data-tooltip-html={user.biography ? dataTooltipHtml : undefined}
            data-tooltip-float={user.biography ? true : undefined}
            data-tooltip-variant={user.biography ? "light" : undefined}
            data-tooltip-place={user.biography ? "top" : undefined}
        />
    ) : (
        <div
            className="user-avatar-initials"
            data-tooltip-id={user.biography ? "tooltip" : undefined}
            data-tooltip-html={user.biography ? dataTooltipHtml : undefined}
            data-tooltip-float={user.biography ? true : undefined}
            data-tooltip-variant={user.biography ? "light" : undefined}
            data-tooltip-place={user.biography ? "top" : undefined}
        >
            {user.username?.charAt(0).toUpperCase() || '?'}
        </div>
    );

    return isUserLoggedIn &&
        (teamPages.some((page) => currentPathname.includes(page)) ||
            canUpdateProject(null, projectSlug) ||
            authUser.id === user.id) ? (
        <NavLink className="react-tooltip__user" to={getUserLink()} end>
            {avatarContent}
            {isUsernameVisible && user.username}
        </NavLink>
    ) : (
        <div className="react-tooltip__user">
            {avatarContent}
            {isUsernameVisible && user.username}
        </div>
    );
};

export default TooltipUserAvatar;

/**
 * External dependencies
 */
import React, { createContext, useContext } from 'react';

/**
 * Internal dependencies
 */
import useAuthenticatedUserShowQuery from '@app/data/user/use-authenticated-user-show-query';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';

const PermissionsContextApi = createContext();

export function usePermissionsContextApi() {
    return useContext(PermissionsContextApi);
}

/**
 * User roles
 */
const admin = 'Admin';
const teamMember = 'Team Member';
const communityMember = 'Community Member';

const PermissionsContextApiProvider = ({ children }) => {
    const { selectedValue } = useHeaderSelectContext();
    const { data: authUser, isLoading: isAuthUserLoading } =
        useAuthenticatedUserShowQuery(selectedValue);

    const checkAuthUserPermission = (
        permissionName,
        projectId,
        projectSlug
    ) => {
        if (isAuthUserCommunityMember(projectId)) {
            return false;
        }

        const project = authUser?.permissions.find(
            (item) =>
                item.project_id === parseInt(projectId) ||
                item.project_slug === projectSlug
        );

        return (
            project?.permission.includes(permissionName) ||
            project?.permission.includes('*')
        );
    };

    const isAuthUserCommunityMember = (projectId, projectSlug = null) =>
        authUser?.permissions.some(
            (item) =>
                (item.project_slug === projectSlug ||
                    item.project_id === parseInt(projectId)) &&
                item.role === communityMember
        );

    const isAuthUserAdmitOrTeamMember = (projectId, projectSlug = null) =>
        authUser?.permissions.some(
            (item) =>
                (item.project_slug === projectSlug ||
                    (item.project_id === parseInt(projectId)) |
                        (item?.creator?.id === authUser.id)) &&
                (item.role === teamMember || item.role === admin)
        );

    const isAuthUserAssignToProject = (projectId = null, projectSlug = null) =>
        isAuthUserCommunityMember(projectId, projectSlug) ||
        isAuthUserAdmitOrTeamMember(projectId, projectSlug);

    const isAuthUserAdminOrTeamMemberToAnyProjects = authUser?.permissions.some(
        (item) => item.role === teamMember || item.role === admin
    );

    const isAuthUserAssignedToAnyProjects = authUser?.permissions.some(
        (item) =>
            item.role === teamMember ||
            item.role === admin ||
            item.role === communityMember
    );

    const isAuthUserAdminToAnyProjects = authUser?.permissions.some(
        (item) => item.role === admin
    );

    const canUpdateProject = (projectId, projectSlug = null) =>
        authUser?.permissions.some(
            (item) =>
                (item.project_slug === projectSlug ||
                    item.project_id === parseInt(projectId) ||
                    item?.creator?.id === authUser.id) &&
                item.role === admin
        );

    if (isAuthUserLoading) {
        return null;
    }

    return (
        <PermissionsContextApi.Provider
            value={{
                isUserLoggedIn: window.isLoggedIn,
                authUser,
                checkAuthUserPermission,
                canUpdateProject,
                isAuthUserCommunityMember,
                isAuthUserAdmitOrTeamMember,
                isAuthUserAssignToProject,
                isAuthUserAdminToAnyProjects,
                isAuthUserAdminOrTeamMemberToAnyProjects,
                isAuthUserAssignedToAnyProjects,
                canCreateProjects: authUser?.can_create_projects,
                canAssignTeamMembers: authUser?.can_assign_team_members,
                canCreateEditTasksFeatures: (projectId) =>
                    checkAuthUserPermission(
                        'can-create-edit-tasks-features',
                        projectId
                    ),
                canCreateEditTaskGroups: (projectId) =>
                    checkAuthUserPermission(
                        'can-create-edit-task-groups',
                        projectId
                    ),
                canPinComments: (projectId) =>
                    checkAuthUserPermission('can-pin-comments', projectId),
                canEditCustomHeader: (projectId, projectSlug) =>
                    checkAuthUserPermission(
                        'can-edit-custom-header',
                        projectId,
                        projectSlug
                    ),
                canDeleteComments: (projectId) =>
                    checkAuthUserPermission('can-delete-comments', projectId) ||
                    canUpdateProject(projectId),
                canEditProductNews: (projectId) =>
                    checkAuthUserPermission('can-edit-product-news', projectId),
                canUpdateReleaseNotes: (projectId) =>
                    checkAuthUserPermission(
                        'can-update-release-notes',
                        projectId
                    ),
                canAdoptSubmissions: (projectId) =>
                    checkAuthUserPermission('can-adopt-submissions', projectId),
            }}
        >
            {children}
        </PermissionsContextApi.Provider>
    );
};

export default PermissionsContextApiProvider;

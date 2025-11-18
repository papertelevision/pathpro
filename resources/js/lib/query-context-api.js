/**
 * External dependencies
 */
import React, { createContext, useContext } from 'react';

/**
 * Internal dependencies
 */
import useProjectsIndexQuery from '@app/data/project/use-projects-index-query';
import useVisibilitiesIndexQuery from '@app/data/project/use-visibilities-index-query';
import useNavigationShowQuery from '@app/data/navigation/use-navigation-show-query';
import { usePermissionsContextApi } from './permissions-context-api';

const QueryContextApi = createContext();

export function useQueryContextApi() {
    return useContext(QueryContextApi);
}

const QueryContextApiProvider = ({ children }) => {
    const { isUserLoggedIn, authUser } = usePermissionsContextApi();

    const { data: projects, isLoading: isProjectsDataLoading } =
        useProjectsIndexQuery();

    const { data: visibilities, isLoading: isVisibilitiesDataLoading } =
        useVisibilitiesIndexQuery();

    const { isLoading: isNavigationDataLoading, data: navigation } =
        useNavigationShowQuery();

    if (
        isProjectsDataLoading ||
        isVisibilitiesDataLoading ||
        isNavigationDataLoading
    ) {
        return null;
    }

    // Disable 'Private' visibility option if needed.
    const projectVisibilities = isUserLoggedIn
        ? visibilities.projectVisibilities.map((vb) => ({
              ...vb,
              label:
                  vb.value === 'private' &&
                  !authUser.are_private_projects_allowed ? (
                      <>
                          <strong>Private/Internal</strong>{' '}
                          <i>(Upgrade plan to unlock this feature)</i>
                      </>
                  ) : (
                      vb.label
                  ),
              disabled:
                  vb.value === 'private' &&
                  !authUser.are_private_projects_allowed,
          }))
        : visibilities.projectVisibilities;

    return (
        <QueryContextApi.Provider
            value={{
                projectVisibilities: projectVisibilities,
                featureVisibilities: visibilities.featureVisibilities,
                taskGroupVisibilities: visibilities.taskGroupVisibilities,
                taskVisibilities: visibilities.taskGroupVisibilities,
                projects,
                navigation,
            }}
        >
            {children}
        </QueryContextApi.Provider>
    );
};

export default QueryContextApiProvider;

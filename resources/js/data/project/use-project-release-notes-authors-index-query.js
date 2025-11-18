/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const useProjectReleaseNotesAuthorsIndexQuery = (projectId) => {
    const { isUserLoggedIn, isAuthUserCommunityMember } =
        usePermissionsContextApi();

    return useQuery(
        ['project/release-notes/authors/index', projectId],
        () => fetchData(`/api/projects/${projectId}/release-notes/authors`),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            enabled: isUserLoggedIn && !isAuthUserCommunityMember(projectId),
        }
    );
};

export default useProjectReleaseNotesAuthorsIndexQuery;

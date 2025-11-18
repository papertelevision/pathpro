/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectTeamMembersIndexQuery = (
    projectSlug,
    currentTablePage,
    queryArgs
) =>
    useQuery(
        ['project/team-members/index', projectSlug, currentTablePage],
        () =>
            apiClient.get(`/api/team-members`, {
                params: {
                    page: currentTablePage,
                    project: projectSlug,
                    ...queryArgs,
                },
            }),
        {
            select: (response) => response?.data,
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useProjectTeamMembersIndexQuery;

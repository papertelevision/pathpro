/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectCommunityMembersIndexQuery = (
    projectSlug,
    currentTablePage,
    queryArgs
) =>
    useQuery(
        [
            'project/community-members/index',
            projectSlug,
            currentTablePage,
            queryArgs,
        ],
        () =>
            apiClient.get(`/api/community-members`, {
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

export default useProjectCommunityMembersIndexQuery;

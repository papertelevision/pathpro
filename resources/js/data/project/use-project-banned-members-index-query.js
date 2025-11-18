/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectBannedMembersIndexQuery = (projectSlug, currentTablePage) =>
    useQuery(
        ['project/banned-members/index', projectSlug, currentTablePage],
        () =>
            apiClient.get(`/api/banned-members`, {
                params: {
                    page: currentTablePage,
                    project: projectSlug,
                },
            }),
        {
            select: (response) => response?.data,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useProjectBannedMembersIndexQuery;

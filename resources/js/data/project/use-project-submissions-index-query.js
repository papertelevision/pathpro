/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectSubmissionsIndexQuery = (
    projectSlug,
    currentTablePage,
    queryArgs
) =>
    useQuery(
        ['project/submissions/index', projectSlug, currentTablePage, queryArgs],
        () =>
            apiClient.get(`/api/submissions`, {
                params: {
                    page: currentTablePage,
                    project: projectSlug,
                    ...queryArgs,
                },
            }),
        {
            select: (response) => response?.data,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useProjectSubmissionsIndexQuery;

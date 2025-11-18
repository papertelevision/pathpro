/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectTaskGroupsIndexQuery = (projectSlug, params) =>
    useQuery(
        ['projects/task-groups/index', projectSlug, params],
        () =>
            apiClient.get(`/api/projects/${projectSlug}/task-groups`, {
                params: {
                    ...params,
                },
            }),
        {
            select: (response) => response?.data,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useProjectTaskGroupsIndexQuery;

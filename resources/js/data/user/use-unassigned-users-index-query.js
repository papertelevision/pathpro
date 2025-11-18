/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useUnassignedUsersIndexQuery = (projectSlug) =>
    useQuery(
        `unassigned-users/index`,
        () =>
            apiClient.get(`/api/unassigned-users`, {
                params: {
                    project: projectSlug,
                },
            }),
        {
            select: (response) => response?.data?.data,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useUnassignedUsersIndexQuery;

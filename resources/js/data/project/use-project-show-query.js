/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectShowQuery = (projectSlug, options) =>
    useQuery(
        ['projects/show', projectSlug],
        () => {
            return apiClient.get(`/api/projects/${projectSlug}`);
        },
        {
            select: (response) => response?.data?.data,
            ...options,
        }
    );

export default useProjectShowQuery;

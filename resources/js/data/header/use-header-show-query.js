/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useHeaderShowQuery = (projectSlug) =>
    useQuery(
        ['header/show', projectSlug],
        () => apiClient.get(`/api/header/${projectSlug}`),
        {
            select: (response) => response?.data?.data,
            onError: (error) => alert(error.response.data.message),
            enabled: !!projectSlug,
        }
    );

export default useHeaderShowQuery;

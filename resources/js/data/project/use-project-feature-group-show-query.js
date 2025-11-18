/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectFeatureGroupShowQuery = (projectSlug) => {
    return useQuery(
        [`project/featureGroup/show`, projectSlug],
        () => apiClient.get(`/api/projects/${projectSlug}/feature-group`, {}),
        {
            select: (response) => response.data,
            onError: (error) => alert(error.response.data.message),
            staleTime: 20 * 1000,
        }
    );
};

export default useProjectFeatureGroupShowQuery;

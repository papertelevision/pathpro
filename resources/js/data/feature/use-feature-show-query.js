/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useFeatureShowQuery = (featureId, params) => {
    return useQuery(
        [`feature/show`, parseInt(featureId)],
        () => {
            return apiClient.get(`/api/features/${featureId}`);
        },
        {
            select: (response) => response?.data,
            onError: (error) => alert(error.response.data.message),
            ...params,
        }
    );
};

export default useFeatureShowQuery;

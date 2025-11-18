/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useFeaturesCommentsShowQuery = (sortBy, featureId, params) =>
    useQuery(
        ['feature/comments/show/', parseInt(featureId), sortBy],
        () =>
            fetchData(
                `/api/features/${featureId}/comments?sortBy=${
                    sortBy ? sortBy : 'is_comment_pinned_to_top'
                }`
            ),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            ...params,
        }
    );

export default useFeaturesCommentsShowQuery;

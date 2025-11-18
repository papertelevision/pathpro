/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useFeatureTypesIndexQuery = () =>
    useQuery('feature-types/index', () => fetchData(`/api/feature-types`), {
        onError: (error) => alert(error.response.data.message),
    });

export default useFeatureTypesIndexQuery;

/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useSubmissionStatusIndexQuery = () =>
    useQuery(
        ['submission-statuses/index'],
        () => fetchData(`/api/submission-statuses`),
        {
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useSubmissionStatusIndexQuery;

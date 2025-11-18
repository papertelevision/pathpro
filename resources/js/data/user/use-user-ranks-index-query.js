/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useUserRanksIndexQuery = () =>
    useQuery(`ranks/index`, () => fetchData(`/api/ranks`), {
        onSuccess: (response) => response,
        onError: (error) => alert(error.response.data.message),
    });

export default useUserRanksIndexQuery;

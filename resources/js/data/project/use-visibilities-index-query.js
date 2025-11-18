/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useVisibilitiesIndexQuery = () =>
    useQuery(['visibility/index'], () => fetchData(`/api/visibilities`), {
        onError: (error) => alert(error.response.data.message),
    });

export default useVisibilitiesIndexQuery;

/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useNewsShowQuery = (newsId) =>
    useQuery(['news', newsId], () => fetchData(`/api/news/${newsId}`), {
        onSuccess: (response) => response,
        onError: (error) => alert(error.response.data.message),
    });

export default useNewsShowQuery;

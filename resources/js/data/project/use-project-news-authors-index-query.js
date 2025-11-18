/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useProjectNewsAuthorsIndexQuery = (projectId) =>
    useQuery(
        ['project/news/authors/index', projectId],
        () => fetchData(`/api/projects/${projectId}/news/authors`),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useProjectNewsAuthorsIndexQuery;

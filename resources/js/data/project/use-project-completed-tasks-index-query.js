/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useProjectCompletedTasksIndexQuery = (projectSlug) =>
    useQuery(
        ['projects/completed-tasks/index', projectSlug],
        () => fetchData(`/api/projects/${projectSlug}/completed-tasks`),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useProjectCompletedTasksIndexQuery;

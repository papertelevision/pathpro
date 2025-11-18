/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useSubtaskShowQuery = (subtaskId, params) =>
    useQuery(
        [`tasks-subtasks/show`, subtaskId],
        () => {
            return fetchData(`/api/tasks-subtasks/${subtaskId}`);
        },
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            ...params,
        }
    );

export default useSubtaskShowQuery;

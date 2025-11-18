/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useTaskCommentsShowQuery = (sortBy, taskId, params) =>
    useQuery(
        ['task/comments/show/', parseInt(taskId), sortBy],
        () =>
            fetchData(
                `/api/tasks/${taskId}/comments?sortBy=${
                    sortBy ? sortBy : 'is_comment_pinned_to_top'
                }`
            ),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            ...params,
        }
    );

export default useTaskCommentsShowQuery;

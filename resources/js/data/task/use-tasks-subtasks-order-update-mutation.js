/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useTasksSubtasksOrderUpdateMutation = (projectSlug, params) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/tasks-subtasks-order`, payload),
        {
            onSuccess: (response) => response,
            onError: (response) => alert(response),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'projects/task-groups/index',
                    projectSlug,
                    params,
                ]);
            },
        }
    );
};

export default useTasksSubtasksOrderUpdateMutation;

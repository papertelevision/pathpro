/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useSubtaskUpdateMutation = (subtaskId, projectSlug, params) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/subtasks/${subtaskId}`, payload),
        {
            onSuccess: (response) => response,
            onError: (response) => alert(response),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'projects/task-groups/index',
                    projectSlug,
                    params,
                ]);
                queryClient.invalidateQueries([
                    `tasks-subtasks/show`,
                    subtaskId,
                ]);
            },
        }
    );
};

export default useSubtaskUpdateMutation;

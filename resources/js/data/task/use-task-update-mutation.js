/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useTaskUpdateMutation = (taskId, projectSlug, params) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => postData(`/api/tasks/${taskId}`, payload), {
        onSuccess: (response) => response,
        onError: (error) => alert(error.response.data.message),
        onSettled: () => {
            queryClient.invalidateQueries([
                'projects/task-groups/index',
                projectSlug,
                params,
            ]);
            queryClient.invalidateQueries([`task/show`, parseInt(taskId)]);
        },
    });
};

export default useTaskUpdateMutation;

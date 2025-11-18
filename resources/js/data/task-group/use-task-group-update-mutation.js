/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useTaskGroupUpdateMutation = (taskGroupId, projectSlug, params) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/task-groups/${taskGroupId}`, payload),
        {
            onError: (error) => alert(error.response.data.message),
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

export default useTaskGroupUpdateMutation;

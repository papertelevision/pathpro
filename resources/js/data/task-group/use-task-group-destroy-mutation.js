/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useTaskGroupDestroyMutation = (projectSlug, params) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => deleteData(`/api/task-groups/${payload}`), {
        onSuccess: (response) => response,
        onError: (response) => alert(response),
        onSettled: () => {
            queryClient.invalidateQueries([
                'projects/task-groups/index',
                projectSlug,
                params,
            ]);
        },
    });
};

export default useTaskGroupDestroyMutation;

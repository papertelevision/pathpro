/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useTaskDestroyMutation = (projectSlug, queryArgs) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => deleteData(`/api/tasks/${payload}`), {
        onSuccess: () =>
            queryClient.invalidateQueries([
                'projects/task-groups/index',
                projectSlug,
                queryArgs,
            ]),
        onError: (response) => alert(response),
    });
};

export default useTaskDestroyMutation;

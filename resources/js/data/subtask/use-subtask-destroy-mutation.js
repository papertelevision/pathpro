/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useSubtaskDestroyMutation = (projectSlug, queryArgs) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => deleteData(`/api/subtasks/${payload}`), {
        onSuccess: () =>
            queryClient.invalidateQueries([
                'projects/task-groups/index',
                projectSlug,
                queryArgs,
            ]),
        onError: (response) => alert(response),
    });
};

export default useSubtaskDestroyMutation;

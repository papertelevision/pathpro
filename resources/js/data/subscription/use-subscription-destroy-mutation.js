/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useSubscriptionDestroyMutation = (projectSlug, params) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => deleteData(`/api/subscriptions/${payload}`),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'projects/task-groups/index',
                    projectSlug,
                    params,
                ]);
                queryClient.invalidateQueries([
                    'project/features/index',
                    projectSlug,
                    params,
                ]);
            },
        }
    );
};

export default useSubscriptionDestroyMutation;

/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useSubscriptionStoreMutation = (projectSlug, params = {}) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => postData(`/api/subscriptions`, payload), {
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
    });
};

export default useSubscriptionStoreMutation;

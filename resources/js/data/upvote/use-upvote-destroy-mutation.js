/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useUpvoteDestroyMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => deleteData(`/api/upvotes/${payload}`), {
        onError: (error) => alert(error.response.data.message),
        onSettled: () => {
            queryClient.invalidateQueries([
                'authenticated-user/show',
                projectSlug,
            ]);
        },
    });
};
export default useUpvoteDestroyMutation;

/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useUpvoteStoreMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/${projectSlug}/upvotes`, payload),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]);
            },
        }
    );
};

export default useUpvoteStoreMutation;

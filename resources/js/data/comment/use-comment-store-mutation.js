/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useCommentStoreMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/${projectSlug}/comments`, payload),
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

export default useCommentStoreMutation;

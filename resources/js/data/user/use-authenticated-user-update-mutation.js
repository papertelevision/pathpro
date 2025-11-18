/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useAuthenticatedUserUpdateMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/authenticated-user`, payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]);
            },
            onError: (error) => alert(error.response?.data?.message),
        }
    );
};

export default useAuthenticatedUserUpdateMutation;

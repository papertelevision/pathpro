/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useUserAvatarUpdateMutation = (userId, projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/users/${userId}/avatar`, payload),
        {
            onSettled: () =>
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]),
        }
    );
};

export default useUserAvatarUpdateMutation;

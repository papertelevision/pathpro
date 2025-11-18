/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useProjectCommunityMemberDestroyMutation = (projectSlug, userId) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            deleteData(
                `/api/${projectSlug}/community-member/${userId}`,
                payload
            ),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'community-member/show',
                    projectSlug,
                    userId,
                ]);
                queryClient.invalidateQueries(['projects/index']);
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]);
            },
        }
    );
};

export default useProjectCommunityMemberDestroyMutation;

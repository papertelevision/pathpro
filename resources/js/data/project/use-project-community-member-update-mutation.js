/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useProjectCommunityMemberUpdateMutation = (projectSlug, userId) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(`/api/${projectSlug}/community-member/${userId}`, payload),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'community-member/show',
                    projectSlug,
                    userId,
                ]);
            },
        }
    );
};

export default useProjectCommunityMemberUpdateMutation;

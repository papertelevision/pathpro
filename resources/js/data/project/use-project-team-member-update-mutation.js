/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useProjectTeamMemberUpdateMutation = (projectSlug, userId) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/team-member/${userId}`, payload),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'team-member/show',
                    projectSlug,
                    userId,
                ]);
            },
        }
    );
};

export default useProjectTeamMemberUpdateMutation;

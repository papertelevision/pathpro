/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useProjectBannedMemberUpdateMutation = (projectSlug, userId) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(
                projectSlug
                    ? `/api/${projectSlug}/banned-member/${userId || payload}`
                    : `/api/banned-member/${payload}`,
                payload
            ),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'project/banned-members/index',
                    projectSlug,
                    1,
                ]);
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

export default useProjectBannedMemberUpdateMutation;

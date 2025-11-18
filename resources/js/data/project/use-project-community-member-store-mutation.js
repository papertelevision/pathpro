/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useProjectCommunityMemberStoreMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(`/api/${projectSlug}/community-member/store`, payload),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]);
                queryClient.invalidateQueries(['projects/show', projectSlug]);
                queryClient.invalidateQueries(['projects/index']);
            },
        }
    );
};

export default useProjectCommunityMemberStoreMutation;

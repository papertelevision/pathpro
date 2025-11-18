/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useProjectBannedMembersBulkUpdateMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(
                projectSlug
                    ? `/api/${projectSlug}/banned-members`
                    : '/api/banned-members',
                payload
            ),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'project/banned-members/index',
                    projectSlug,
                    1,
                ]);
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]);
            },
        }
    );
};

export default useProjectBannedMembersBulkUpdateMutation;

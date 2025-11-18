/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useAdoptedSubmissionStoreMutation = (
    projectSlug,
    submissionId,
    params
) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(
                `/api/${projectSlug}/adopted-submission/${submissionId}`,
                payload
            ),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries(['projects/show', projectSlug]);
                queryClient.invalidateQueries([
                    'projects/task-groups/index',
                    projectSlug,
                    params,
                ]);
                queryClient.invalidateQueries([
                    'project/features/index',
                    projectSlug,
                    params,
                ]);
                queryClient.invalidateQueries([
                    'project/submission/show',
                    projectSlug,
                    submissionId,
                ]);
            },
        }
    );
};

export default useAdoptedSubmissionStoreMutation;

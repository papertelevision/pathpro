/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useSubmissionUpdateMutation = (
    submissionId,
    projectSlug,
    currentTablePage,
    queryArgs
) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(
                `/api/submissions/${submissionId ? submissionId : payload.id}`,
                payload
            ),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'submissions/index',
                    currentTablePage,
                    queryArgs,
                ]);
                queryClient.invalidateQueries([
                    'project/submissions/index',
                    projectSlug,
                    currentTablePage,
                    queryArgs,
                ]);
                queryClient.invalidateQueries([
                    'project/submission/show',
                    projectSlug,
                    parseInt(submissionId),
                ]);
            },
        }
    );
};

export default useSubmissionUpdateMutation;

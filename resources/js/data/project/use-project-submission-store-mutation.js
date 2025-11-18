/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useProjectSubmissionStoreMutation = (
    projectSlug,
    currentTablePage = 1,
    queryArgs = []
) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => postData('/api/submission', payload), {
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
                'authenticated-user/show',
                projectSlug,
            ]);
            queryClient.invalidateQueries(['projects/index']);
        },
    });
};

export default useProjectSubmissionStoreMutation;

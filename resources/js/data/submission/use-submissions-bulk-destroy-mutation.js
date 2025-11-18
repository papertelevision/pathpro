/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useSubmissionsBulkDestroyMutation = (
    projectSlug,
    currentTablePage,
    queryArgs
) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => deleteData('/api/submissions', payload), {
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
        },
    });
};

export default useSubmissionsBulkDestroyMutation;

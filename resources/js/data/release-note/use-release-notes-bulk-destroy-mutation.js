/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useReleaseNotesBulkDestroyMutation = (
    projectSlug,
    currentTablePage,
    params
) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => deleteData(`/api/${projectSlug}/release-notes`, payload),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'project/release-notes/index',
                    projectSlug,
                    currentTablePage,
                    params,
                ]);
            },
        }
    );
};

export default useReleaseNotesBulkDestroyMutation;

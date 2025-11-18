/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useReleaseNoteUpdateMutation = (
    releaseNoteId,
    projectSlug,
    currentTablePage,
    params
) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/release-notes/${releaseNoteId}`, payload),
        {
            onSuccess: (response) => response,
            onError: (response) => alert(response),
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

export default useReleaseNoteUpdateMutation;

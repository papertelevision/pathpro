/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useReleaseNoteStoreMutation = (projectSlug, currentTablePage, params) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/${projectSlug}/release-notes`, payload),
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

export default useReleaseNoteStoreMutation;

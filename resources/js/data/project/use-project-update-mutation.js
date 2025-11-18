/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useProjectUpdateMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/projects/${projectSlug}`, payload),
        {
            onSuccess: (response) => response,
            onError: (response) => alert(response),
            onSettled: () => {
                queryClient.invalidateQueries('projects/index');
                queryClient.invalidateQueries(['projects/show', projectSlug]);
            },
        }
    );
};

export default useProjectUpdateMutation;

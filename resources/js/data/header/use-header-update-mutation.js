/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useHeaderUpdateMutation = (headerId, projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(`/api/header/${headerId}`, payload, {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            }),
        {
            onSettled: () => {
                queryClient.invalidateQueries(['projects/index']);
                queryClient.invalidateQueries(['projects/show', projectSlug]);
                queryClient.invalidateQueries(['header/show', projectSlug]);
            },
        }
    );
};

export default useHeaderUpdateMutation;

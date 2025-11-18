/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useProjectStoreMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => postData(`/api/projects`, payload), {
        onError: (error) => alert(error.response.data.message),
        onSettled: () => {
            queryClient.invalidateQueries('projects/index');
            queryClient.invalidateQueries([
                'authenticated-user/show',
                projectSlug,
            ]);
        },
    });
};

export default useProjectStoreMutation;

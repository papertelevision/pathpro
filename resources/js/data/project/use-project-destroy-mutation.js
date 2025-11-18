/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useProjectDestroyMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => deleteData(`/api/projects/${payload}`), {
        onError: (response) => alert(response),
        onSettled: () => {
            queryClient.invalidateQueries('projects/index');
            queryClient.invalidateQueries([
                'authenticated-user/show',
                projectSlug,
            ]);
        },
    });
};

export default useProjectDestroyMutation;

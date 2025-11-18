/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useProjectTeamMemberDestroyMutation = (projectSlug, userId) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            deleteData(`/api/${projectSlug}/team-member/${userId}`, payload),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries(['projects/show', projectSlug]);
                queryClient.invalidateQueries('projects/index');
                queryClient.invalidateQueries('unassigned-users/index');
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]);
            },
        }
    );
};

export default useProjectTeamMemberDestroyMutation;

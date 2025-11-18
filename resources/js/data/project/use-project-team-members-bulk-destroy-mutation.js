/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useProjectTeamMembersBulkDestroyMutation = (
    projectSlug,
    currentTablePage,
    queryArgs
) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => deleteData(`/api/${projectSlug}/team-members`, payload),
        {
            onSettled: () => {
                queryClient.invalidateQueries([
                    'project/community-members/index',
                    projectSlug,
                    currentTablePage,
                    queryArgs,
                ]);
                queryClient.invalidateQueries([
                    'project/team-members/index',
                    projectSlug,
                    currentTablePage,
                ]);
                queryClient.invalidateQueries('projects/index');
                queryClient.invalidateQueries(['projects/show', projectSlug]);
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]);
            },
            onError: (error) => alert(error.response.data.message),
        }
    );
};

export default useProjectTeamMembersBulkDestroyMutation;

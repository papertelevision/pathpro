/**
 * External dependencies
 */
import { useMutation } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useTeamMemberInvitationDestroyMutation = (invitationId) =>
    useMutation(
        (payload) =>
            deleteData(`/team-member-invitation/${invitationId}`, payload),
        {
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useTeamMemberInvitationDestroyMutation;

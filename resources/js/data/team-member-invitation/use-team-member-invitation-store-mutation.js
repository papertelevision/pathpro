/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const useTeamMemberInvitationStoreMutation = (
    projectSlug,
    currentTablePage = 1
) => {
    const queryClient = useQueryClient();
    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();

    return useMutation(
        (payload) => postData(`/api/invite-team-member`, payload),
        {
            onSettled: () => {
                queryClient.invalidateQueries([
                    'project/team-members/index',
                    projectSlug,
                    currentTablePage,
                ]);
                queryClient.invalidateQueries([
                    'team-members-invitations/index',
                    projectSlug,
                ]);
                queryClient.invalidateQueries(['projects/index']);
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]);
            },
            onSuccess: (response) => {
                setPopupNotificationText(response.data.message);
                setIsPopupNotificationVisible(true);
            },
            onError: (error) => alert(error.response.data.message),
        }
    );
};

export default useTeamMemberInvitationStoreMutation;

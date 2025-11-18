/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';
import { usePopupNotificationContext } from '@app/lib/popup-notification-context';

const useTeamMemberInvitationUpdateMutation = () => {
    const queryClient = useQueryClient();

    const { setIsPopupNotificationVisible, setPopupNotificationText } =
        usePopupNotificationContext();

    return useMutation(
        (payload) => postData(`/api/reinvite-team-member/${payload}`),
        {
            onSuccess: (response) => {
                queryClient.invalidateQueries([
                    'team-members-invitations/index',
                ]);
                setPopupNotificationText(response.data.message);
                setIsPopupNotificationVisible(true);
            },
            onError: (error) => alert(error.response.data.message),
        }
    );
};

export default useTeamMemberInvitationUpdateMutation;

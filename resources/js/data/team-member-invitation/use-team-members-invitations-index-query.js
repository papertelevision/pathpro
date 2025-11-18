/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useTeamMembersInvitationsIndexQuery = (projectSlug) =>
    useQuery(
        ['team-members-invitations/index', projectSlug],
        () =>
            apiClient.get(`/api/team-members-invitations`, {
                params: {
                    project: projectSlug,
                },
            }),
        {
            select: (response) => response?.data?.data,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useTeamMembersInvitationsIndexQuery;

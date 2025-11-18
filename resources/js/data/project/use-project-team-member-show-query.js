/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useProjectTeamMemberShowQuery = (projectSlug, userId) =>
    useQuery(
        ['team-member/show', projectSlug, userId],
        () =>
            fetchData(
                projectSlug
                    ? `/api/${projectSlug}/team-member/${userId}`
                    : `/api/team-member/${userId}`
            ),
        {
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useProjectTeamMemberShowQuery;

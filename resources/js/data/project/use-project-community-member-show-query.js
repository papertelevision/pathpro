/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useProjectCommunityMemberShowQuery = (projectSlug, userId) =>
    useQuery(['community-member/show', projectSlug, userId], () =>
        fetchData(
            projectSlug
                ? `/api/${projectSlug}/community-member/${userId}`
                : `/api/community-member/${userId}`
        )
    );

export default useProjectCommunityMemberShowQuery;

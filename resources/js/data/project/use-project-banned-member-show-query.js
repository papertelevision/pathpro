/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useProjectBannedMemberShowQuery = (projectSlug, userId) =>
    useQuery(['banned-member/show', projectSlug, userId], () =>
        fetchData(
            projectSlug
                ? `/api/${projectSlug}/banned-member/${userId}`
                : `/api/banned-member/${userId}`
        )
    );

export default useProjectBannedMemberShowQuery;

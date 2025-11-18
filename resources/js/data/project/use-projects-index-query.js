/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const useProjectsIndexQuery = () => {
    const { isUserLoggedIn } = usePermissionsContextApi();

    return useQuery('projects/index', () => fetchData(`/api/projects`), {
        onError: (error) => alert(error.response.data.message),
        enabled: isUserLoggedIn,
    });
};

export default useProjectsIndexQuery;

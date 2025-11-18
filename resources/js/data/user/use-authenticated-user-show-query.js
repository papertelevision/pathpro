/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';
import useLogoutMutation from '@app/data/logout/use-logout-mutation';

const useAuthenticatedUserShowQuery = (projectSlug) => {
    const { mutate: mutateUseLogout } = useLogoutMutation();

    return useQuery(
        ['authenticated-user/show', projectSlug],
        () => fetchData(`/api/authenticated-user?project=${projectSlug}`),
        {
            onError: () => mutateUseLogout(),
            retry: 3,
            enabled: window.isLoggedIn,
        }
    );
};

export default useAuthenticatedUserShowQuery;

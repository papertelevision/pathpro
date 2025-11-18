/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useNavigationShowQuery = () =>
    useQuery('navigation/show', () => fetchData('/api/navigation'), {
        enabled: window.isLoggedIn,
    });

export default useNavigationShowQuery;

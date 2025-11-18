/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useReleaseSettingsShowQuery = () =>
    useQuery('release-settings/show', () => fetchData('/api/release-settings'));

export default useReleaseSettingsShowQuery;

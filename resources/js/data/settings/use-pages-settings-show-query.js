/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const usePagesSettingsShowQuery = () =>
    useQuery('pages-settings/show', () => fetchData('/pages-settings'));

export default usePagesSettingsShowQuery;

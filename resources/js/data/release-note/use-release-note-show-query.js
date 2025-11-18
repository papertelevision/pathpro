/**
 * External dependencies
 */
import { useQuery } from 'react-query';
/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useReleaseNoteShowQuery = (releaseNoteId) =>
    useQuery(
        `release-notes/${releaseNoteId}`,
        () => fetchData(`/api/release-notes/${releaseNoteId}`),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useReleaseNoteShowQuery;

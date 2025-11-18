/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectReleaseNotesIndexQuery = (
    projectSlug,
    currentTablePage,
    params,
    options
) =>
    useQuery(
        ['project/release-notes/index', projectSlug, currentTablePage, params],
        () =>
            apiClient.get(`/api/projects/${projectSlug}/release-notes`, {
                params: {
                    page: currentTablePage,
                    ...params,
                },
            }),
        {
            select: (response) => response?.data,
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            ...options,
        }
    );

export default useProjectReleaseNotesIndexQuery;

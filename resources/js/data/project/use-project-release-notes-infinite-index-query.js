/**
 * External dependencies
 */
import { useInfiniteQuery } from 'react-query';
import { parse } from 'qs';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectReleaseNotesInfinityIndexQuery = (
    projectSlug,
    params = {},
    options
) => {
    return useInfiniteQuery(
        ['project/release-notes/index', projectSlug],
        ({ pageParam }) => {
            return apiClient.get(`/api/projects/${projectSlug}/release-notes`, {
                params: {
                    page: pageParam,
                    ...params,
                },
            });
        },
        {
            getNextPageParam: (response) => {
                if (!response.data.links.next) {
                    return;
                }

                const linksNext = new URL(response.data.links.next);
                const search = parse(linksNext.search, {
                    ignoreQueryPrefix: true,
                });

                return search.page;
            },
            onError: (error) => alert(error.response.data.message),
            ...options,
        }
    );
};

export default useProjectReleaseNotesInfinityIndexQuery;

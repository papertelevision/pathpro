/**
 * External dependencies
 */
import { useInfiniteQuery } from 'react-query';
import { parse } from 'qs';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useProjectFeaturesIndexQuery = (projectSlug, params = {}) => {
    return useInfiniteQuery(
        ['project/features/index', projectSlug, params],
        ({ pageParam }) => {
            return apiClient.get(`/api/projects/${projectSlug}/features`, {
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
        }
    );
};

export default useProjectFeaturesIndexQuery;

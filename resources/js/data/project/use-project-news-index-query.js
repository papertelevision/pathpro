/**
 * External dependencies.
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies.
 */
import apiClient from '@app/lib/fetch-data';

const useProjectNewsIndexQuery = (projectSlug, currentTablePage, params) =>
    useQuery(
        ['project/news/index', projectSlug, currentTablePage, params],
        () =>
            apiClient.get(`/api/${projectSlug}/news`, {
                params: {
                    page: currentTablePage,
                    ...params,
                },
            }),
        {
            select: (response) => response?.data,
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useProjectNewsIndexQuery;

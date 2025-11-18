/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useNewsStoreMutation = (projectSlug, currentTablePage, params) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/${projectSlug}/news`, payload),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'project/news/index',
                    projectSlug,
                    currentTablePage,
                    params,
                ]);
            },
        }
    );
};

export default useNewsStoreMutation;

/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useNewsUpdateMutation = (
    newsUpdateId,
    projectSlug,
    currentTablePage,
    params
) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/news/${newsUpdateId}`, payload),
        {
            onSuccess: (response) => response,
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

export default useNewsUpdateMutation;

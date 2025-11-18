/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useConfirmedFeatureStoreMutation = (projectSlug, featureId, params) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/confirmed-feature/${featureId}`, payload),
        {
            onSuccess: (response) => response,
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'projects/task-groups/index',
                    projectSlug,
                    params,
                ]);
                queryClient.invalidateQueries([
                    'project/features/index',
                    projectSlug,
                    params,
                ]);
            },
        }
    );
};

export default useConfirmedFeatureStoreMutation;

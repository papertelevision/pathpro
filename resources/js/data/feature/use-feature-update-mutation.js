/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useFeatureUpdateMutation = (featureId, projectSlug, queryArgs) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/features/${featureId}`, payload),
        {
            onSuccess: (response) => response,
            onError: (response) => alert(response),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'project/features/index',
                    projectSlug,
                    queryArgs,
                ]);
                queryClient.invalidateQueries(
                    `feature/show`,
                    parseInt(featureId)
                );
                queryClient.invalidateQueries([
                    'project/featureGroup/show',
                    projectSlug,
                ]);
            },
        }
    );
};

export default useFeatureUpdateMutation;

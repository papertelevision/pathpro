/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { deleteData } from '@app/lib/delete-data';

const useFeatureDestroyMutation = (featureId, projectSlug, queryArgs) => {
    const queryClient = useQueryClient();

    return useMutation(() => deleteData(`/api/features/${featureId}`), {
        onError: (error) => alert(error.response.data.message),
        onSuccess: () => {
            queryClient.invalidateQueries([
                'project/features/index',
                projectSlug,
                queryArgs,
            ]);
            queryClient.invalidateQueries([
                'project/featureGroup/show',
                projectSlug,
            ]);
        },
    });
};

export default useFeatureDestroyMutation;

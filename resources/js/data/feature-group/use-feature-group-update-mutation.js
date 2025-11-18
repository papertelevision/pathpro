/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useFeatureGroupUpdateMutation = (id, projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(`/api/feature-groups/${id}`, payload, {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            }),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'project/featureGroup/show',
                    projectSlug,
                ]);
            },
        }
    );
};

export default useFeatureGroupUpdateMutation;

/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';
import { useLocation } from 'react-router';
import qs from 'qs';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useFeatureStoreMutation = (projectSlug) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    return useMutation(
        (payload) => postData(`/api/${projectSlug}/features`, payload),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'project/features/index',
                    projectSlug,
                    queryArgs,
                ]);
                queryClient.invalidateQueries(['projects/show', projectSlug]);
                queryClient.invalidateQueries([
                    'project/featureGroup/show',
                    projectSlug,
                ]);
            },
        }
    );
};

export default useFeatureStoreMutation;

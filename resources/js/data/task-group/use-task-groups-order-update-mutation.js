/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useTaskGroupsOrderUpdateMutation = (projectSlug, params) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) => postData(`/api/${projectSlug}/task-groups-order`, payload),
        {
            onSuccess: () =>
                queryClient.invalidateQueries([
                    'projects/task-groups/index',
                    projectSlug,
                    params,
                ]),
            onError: (response) => alert(response),
        }
    );
};

export default useTaskGroupsOrderUpdateMutation;

/**
 * External dependencies
 */
import { useMutation } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useTaskGroupIconUpdateMutation = (taskGroupId) =>
    useMutation(
        (payload) => postData(`/api/task-groups/${taskGroupId}/icon`, payload),
        {
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useTaskGroupIconUpdateMutation;

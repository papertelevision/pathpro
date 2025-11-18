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

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const useCommentUpdateMutation = (commentId, commentableId, sortCommentsBy) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const queryArgs = qs.parse(location?.search, { ignoreQueryPrefix: true });

    return useMutation(
        (payload) => postData(`/api/comments/${commentId}`, payload),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () => {
                queryClient.invalidateQueries([
                    'task/comments/show/',
                    parseInt(commentableId),
                    sortCommentsBy,
                ]);
                queryClient.invalidateQueries([
                    'feature/comments/show/',
                    parseInt(commentableId),
                    sortCommentsBy,
                ]);
                queryClient.invalidateQueries([
                    `feature/show`,
                    parseInt(commentableId),
                ]);

                queryClient.invalidateQueries([
                    'project/release-notes/index',
                    projectSlug,
                ]);
                queryClient.invalidateQueries([
                    'projects/task-groups/index',
                    projectSlug,
                    queryArgs,
                ]);
                queryClient.invalidateQueries([
                    'project/features/index',
                    projectSlug,
                    queryArgs,
                ]);
            },
        }
    );
};

export default useCommentUpdateMutation;

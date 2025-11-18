/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const useProjectCommunityMemberRegisterMutation = () => {
    const queryClient = useQueryClient();

    return useMutation((payload) => postData('/register/store', payload), {
        onSuccess: () => {
            window.isLoggedIn = true;
        },
        onSettled: () => {
            queryClient.invalidateQueries([
                'authenticated-user/show',
                projectSlug,
            ]);
        },
    });
};

export default useProjectCommunityMemberRegisterMutation;

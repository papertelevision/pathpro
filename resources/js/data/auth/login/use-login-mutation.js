/**
 * External dependencies
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { postData } from '@app/lib/post-data';

const useLoginMutation = (projectSlug) => {
    const { setSelectedValue } = useHeaderSelectContext();

    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    return useMutation((payload) => postData(`/login`, payload), {
        onSuccess: (response) => {
            localStorage.clear();
            setSelectedValue();
            window.isLoggedIn = true;
            const serverRedirectTo = response.data?.redirectTo;
            navigate(location.state?.redirectTo || serverRedirectTo);
        },
        onSettled: () =>
            queryClient.invalidateQueries([
                'authenticated-user/show',
                projectSlug,
            ]),
    });
};

export default useLoginMutation;

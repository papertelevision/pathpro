/**
 * External dependencies
 */
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';

const useLogoutMutation = () => {
    const { setSelectedValue } = useHeaderSelectContext();

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation(() => postData(`/logout`), {
        onSuccess: () => {
            queryClient.removeQueries();
            window.isLoggedIn = false;
            setSelectedValue();
            localStorage.clear();
            navigate('/login');
        },
        onError: (error) => alert(error.response.data.message),
    });
};

export default useLogoutMutation;

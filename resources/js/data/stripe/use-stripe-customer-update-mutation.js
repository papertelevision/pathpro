/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useStripeCustomerUpdateMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation((payload) => postData('/api/stripe-customer', payload), {
        onError: (error) => alert(error.response.data.message),
        onSettled: () => {
            queryClient.invalidateQueries([
                'authenticated-user/show',
                projectSlug,
            ]);
        },
    });
};

export default useStripeCustomerUpdateMutation;

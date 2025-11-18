/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useStripeSubscriptionUpdateMutation = (projectSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(
                `/api/stripe-subscription/${payload.stripeProductId}`,
                payload
            ),
        {
            onError: (error) => alert(error.response.data.message),
            onSuccess: () => {
                queryClient.invalidateQueries(
                    'auth-user/stripe-products/index'
                );
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    projectSlug,
                ]);
            },
        }
    );
};

export default useStripeSubscriptionUpdateMutation;

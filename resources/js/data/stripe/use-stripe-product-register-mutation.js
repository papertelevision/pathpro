/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useStripeProductRegisterMutation = (stripeProductSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(
                `/stripe-purchase-product/${stripeProductSlug}/register`,
                payload
            ),
        {
            onSettled: () =>
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    null,
                ]),
        }
    );
};
export default useStripeProductRegisterMutation;

/**
 * External dependencies
 */
import { useMutation, useQueryClient } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const useStripeProductPurchaseMutation = (stripeProductSlug) => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload) =>
            postData(
                `/stripe-purchase-product/${stripeProductSlug}/purchase`,
                payload
            ),
        {
            onError: (error) => alert(error.response.data.message),
            onSettled: () =>
                queryClient.invalidateQueries([
                    'authenticated-user/show',
                    undefined,
                ]),
        }
    );
};

export default useStripeProductPurchaseMutation;

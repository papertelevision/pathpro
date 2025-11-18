/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useStripeProductShowQuery = (stripeProductSlug) =>
    useQuery(
        ['stripe-product/show', stripeProductSlug],
        () =>
            apiClient.get(`/stripe-purchase-product/${stripeProductSlug}/show`),
        {
            select: (response) => response?.data?.data,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useStripeProductShowQuery;

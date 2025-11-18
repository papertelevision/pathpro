/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useStripeProductsIndexQuery = () =>
    useQuery('stripe-products/index', () => apiClient.get('/stripe-products'), {
        select: (response) => response?.data?.data,
        onError: (error) => alert(error.response.data.message),
    });

export default useStripeProductsIndexQuery;

/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import apiClient from '@app/lib/fetch-data';

const useStripeAuthUserProductsIndexQuery = () =>
    useQuery(
        'auth-user/stripe-products/index',
        () => apiClient.get('api/auth-user/stripe-products'),
        {
            select: (response) => response?.data?.data,
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useStripeAuthUserProductsIndexQuery;

/**
 * External dependencies
 */
import { useMutation } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const usePasswordForgotMutation = () =>
    useMutation((payload) => postData('forgot-password', payload));

export default usePasswordForgotMutation;

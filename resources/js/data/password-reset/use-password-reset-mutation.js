/**
 * External dependencies
 */
import { useMutation } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const usePasswordResetMutation = () =>
    useMutation((payload) => postData(`/api/reset-password`, payload));

export default usePasswordResetMutation;

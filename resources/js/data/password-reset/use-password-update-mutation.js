/**
 * External dependencies
 */
import { useMutation } from 'react-query';

/**
 * Internal dependencies
 */
import { postData } from '@app/lib/post-data';

const usePasswordUpdateMutation = (email) =>
    useMutation((payload) => postData(`/reset-password/${email}`, payload));

export default usePasswordUpdateMutation;

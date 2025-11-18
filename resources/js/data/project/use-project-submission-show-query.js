/**
 * External dependencies
 */
import { useQuery } from 'react-query';

/**
 * Internal dependencies
 */
import { fetchData } from '@app/lib/fetch-data';

const useProjectSubmissionShowQuery = (projectSlug, submissionId) =>
    useQuery(
        ['project/submission/show', projectSlug, parseInt(submissionId)],
        () => fetchData(`/api/${projectSlug}/submission/${submissionId}`),
        {
            onError: (error) => alert(error.response.data.message),
        }
    );

export default useProjectSubmissionShowQuery;

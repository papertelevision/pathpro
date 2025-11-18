/**
 * Internal dependencies.
 */
import { useDomain, useSubdomain } from '@app/lib/domain';

export const handleHeaderSelectOptions = (
    selectedProjectSlug,
    isFirstOptionSelected,
    location,
    params
) => {
    let pathname = location.pathname;
    const search = location.search;

    const { newsId, userId, submissionId, releaseNoteId } = params;
    const param = newsId || userId || submissionId || releaseNoteId;

    const isNewsPage = pathname.includes('/news');
    const isFeaturesPage = pathname.includes('/features');
    const isReleaseNotesPage = pathname.includes('/release-notes');

    const redirectToProjectsPage =
        isFirstOptionSelected &&
        (isNewsPage || isFeaturesPage || isReleaseNotesPage);

    if (redirectToProjectsPage) {
        pathname = 'projects';
    } else if (param) {
        pathname = pathname.replace(`/${param}`, '');
    }

    window.location.href = isFirstOptionSelected
        ? useDomain(pathname, search)
        : useSubdomain(selectedProjectSlug, pathname, search);
};

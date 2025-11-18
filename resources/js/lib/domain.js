export const useDomain = (page = '', params = '') => {
    if (page?.charAt(0) == '/') {
        page = page.substring(1);
    }

    return `${window.location.protocol}//${process.env.MIX_APP_DOMAIN}/${page}${params}`;
};

export const useSubdomain = (projectSlug, page = '', params = '') => {
    if (page?.charAt(0) == '/') {
        page = page.substring(1);
    }

    return `${window.location.protocol}//${projectSlug}.${process.env.MIX_APP_DOMAIN}/${page}${params}`;
};

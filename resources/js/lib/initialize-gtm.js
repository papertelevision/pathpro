/**
 * External dependencies.
 */
import TagManager from 'react-gtm-module';

const tagManagerArgs = {
    gtmId: process.env.MIX_GOOGLE_TAG_MANAGER_ID,
};

const initializeGTM = () => {
    if (process.env.MIX_APP_ENV !== 'local') {
        TagManager.initialize(tagManagerArgs);
    }
};

export default initializeGTM;

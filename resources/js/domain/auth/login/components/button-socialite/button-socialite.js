/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Internal dependencies
 */
import IconGoogle from '@/images/icon-google.png';
import IconFacebook from '@/images/icon-facebook.png';
import { axiosInstance } from '@app/lib/axios';

const ButtonSocialite = ({
    type,
    disabled = false,
    redirectTo,
    action = null,
}) => {
    const [fetchData, setFetchData] = useState(true);
    const [redirectUrl, setRedirectUrl] = useState(null);

    const location = useLocation();

    useEffect(() => {
        if (fetchData) {
            const redirectUrl = location.state?.redirectTo || redirectTo;

            axiosInstance
                .get(
                    `/auth/${type}${
                        redirectUrl ? `?redirectTo=${redirectUrl}` : ''
                    }${action ? `&&action=${action}` : ''}`
                )
                .then((response) => {
                    setFetchData(false);
                    setRedirectUrl(response.data.url);
                })
                .catch((error) => alert(error.response.data.message));
        }
        return () => setFetchData(false);
    }, []);

    if (!redirectUrl) {
        return null;
    }

    return (
        <a className="login__socialite" href={!disabled && redirectUrl}>
            {type === 'google' && (
                <>
                    <img src={IconGoogle} />
                    Google
                </>
            )}
            {type === 'facebook' && (
                <>
                    <img src={IconFacebook} />
                    Facebook
                </>
            )}
        </a>
    );
};

export default ButtonSocialite;

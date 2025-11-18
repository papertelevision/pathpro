/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router';

/**
 * Internal dependencies
 */
import Page from '@app/components/page/page';
import Button from '@app/components/button/button';
import BaseLayout from '@app/components/base-layout/base-layout';
import useLogoutMutation from '@app/data/logout/use-logout-mutation';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';

const Fallback = () => {
    const location = useLocation();
    const { mutate: mutateUseLogout } = useLogoutMutation();
    const { setSelectedValue } = useHeaderSelectContext();

    useEffect(() => {
        setSelectedValue();
    }, []);

    return (
        <BaseLayout hideSidebar>
            <Page modifier="fallback">
                {location?.state?.message || 'Something went wrong!'}
                <NavLink to="/account">Account page</NavLink>
                <Button
                    type="button"
                    color="red-text"
                    onClick={mutateUseLogout}
                >
                    Sign Out
                </Button>
            </Page>
        </BaseLayout>
    );
};

export default Fallback;

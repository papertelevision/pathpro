/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { parse } from 'qs';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import ModalLimit from '@app/components/modal/modal-limit';
import Page from '@app/components/page/page';
import TableUsersCommunityMembers from '@app/domain/user/components/table-users-community-members/table-users-community-members';
import Loader from '@app/components/loader/loader';
import useProjectCommunityMembersIndexQuery from '@app/data/project/use-project-community-members-index-query';
import useUserRanksIndexQuery from '@app/data/user/use-user-ranks-index-query';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const UsersCommunityMembersIndex = () => {
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [currentTableFilterValue, setCurrentTableFilterValue] = useState();
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

    const location = useLocation();
    const queryArgs = parse(location.search, { ignoreQueryPrefix: true });

    const {
        data: communityMembers,
        isLoading: isProjectCommunityMembersDataLoading,
    } = useProjectCommunityMembersIndexQuery(
        projectSlug,
        currentTablePage,
        queryArgs
    );
    const { data: userRanksData, isLoading: isUserRanksDataLoading } =
        useUserRanksIndexQuery();

    if (isProjectCommunityMembersDataLoading || isUserRanksDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <>
            <Subheader>
                <Subheader.Left title="Community Members" />
            </Subheader>
            <Page upper color="gray">
                <TableUsersCommunityMembers
                    communityMembers={communityMembers}
                    ranks={userRanksData}
                    currentTablePage={currentTablePage}
                    setCurrentTablePage={setCurrentTablePage}
                    currentTableFilterValue={currentTableFilterValue}
                    setCurrentTableFilterValue={setCurrentTableFilterValue}
                />
            </Page>
            <ModalLimit
                isOpen={isLimitModalOpen}
                setIsOpen={setIsLimitModalOpen}
                type="communityMembers"
            />
        </>
    );
};

export default UsersCommunityMembersIndex;

/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import Page from '@app/components/page/page';
import TableBannedMembers from '@app/domain/user/components/table-banned-members/table-banned-members';
import Loader from '@app/components/loader/loader';
import useProjectBannedMembersIndexQuery from '@app/data/project/use-project-banned-members-index-query';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const UsersBannedMembersIndex = () => {
    const [currentTablePage, setCurrentTablePage] = useState(1);

    const { data: members, isLoading: isMembersDataLoading } =
        useProjectBannedMembersIndexQuery(projectSlug, currentTablePage);

    if (isMembersDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <>
            <Subheader>
                <Subheader.Left title="Banned Members" />
            </Subheader>
            <Page upper color="gray">
                <TableBannedMembers
                    members={members}
                    setCurrentTablePage={setCurrentTablePage}
                />
            </Page>
        </>
    );
};

export default UsersBannedMembersIndex;

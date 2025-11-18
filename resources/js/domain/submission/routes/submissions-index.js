/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { parse } from 'qs';
import { startCase } from 'lodash';

/**
 * Internal dependencies
 */
import Subheader from '@app/components/subheader/subheader';
import Button from '@app/components/button/button';
import Page from '@app/components/page/page';
import TableSubmissionsIndex from '@app/domain/submission/components/table-submissions/table-submissions-index';
import Modal from '@app/components/modal/modal';
import FormAddSubmission from '@app/domain/submission/components/form-add-submission/form-add-submission';
import Loader from '@app/components/loader/loader';
import useProjectSubmissionsIndexQuery from '@app/data/project/use-project-submissions-index-query';
import useSubmissionStatusIndexQuery from '@app/data/submission/use-submission-status-index-query';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const SubmissionsIndex = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const queryArgs = parse(location.search, { ignoreQueryPrefix: true });

    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [currentTableFilterValue, setCurrentTableFilterValue] = useState({
        label: startCase(searchParams.get('status')) || 'All',
        value: searchParams.get('status') || 'All',
    });

    const [isAddSubmissionModalOpen, setIsAddSubmissionModalOpen] =
        useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const { data: submissions, isLoading: isProjectSubmissionsDataLoading } =
        useProjectSubmissionsIndexQuery(
            projectSlug,
            currentTablePage,
            queryArgs
        );
    const { data: statuses, isLoading: isStatusesDataLoading } =
        useSubmissionStatusIndexQuery();

    const closeAddSubmissionModal = () =>
        isFormChanged
            ? setOpenAlertBox(true)
            : setIsAddSubmissionModalOpen(false);

    if (isProjectSubmissionsDataLoading || isStatusesDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <>
            <Subheader>
                <Subheader.Left title="Submissions from Your Community" />

                <Subheader.Right>
                    <Button
                        type="button"
                        modifier="add-record"
                        icon
                        onClick={() => setIsAddSubmissionModalOpen(true)}
                    >
                        Add New
                    </Button>
                </Subheader.Right>
            </Subheader>
            <Page upper color="gray">
                <TableSubmissionsIndex
                    submissions={submissions}
                    statuses={statuses}
                    currentTablePage={currentTablePage}
                    setCurrentTablePage={setCurrentTablePage}
                    currentTableFilterValue={currentTableFilterValue}
                    setCurrentTableFilterValue={setCurrentTableFilterValue}
                    queryArgs={queryArgs}
                />
            </Page>

            <Modal
                className="full-height"
                modalIsOpen={isAddSubmissionModalOpen}
                setIsModalOpen={setIsAddSubmissionModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeAddSubmissionModal}
            >
                <Modal.Content>
                    <FormAddSubmission
                        closeModal={closeAddSubmissionModal}
                        setIsFormChanged={setIsFormChanged}
                        setIsAddSubmissionModalOpen={
                            setIsAddSubmissionModalOpen
                        }
                        currentTablePage={currentTablePage}
                    />
                </Modal.Content>
            </Modal>
        </>
    );
};

export default SubmissionsIndex;

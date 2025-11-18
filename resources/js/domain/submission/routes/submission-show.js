/**
 * External dependencies
 */
import React, { Fragment, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';
import Subheader from '@app/components/subheader/subheader';
import FormUpdateSubmission from '@app/domain/submission/components/form-update-submission/form-update-submission';
import FormAdoptSubmission from '@app/domain/submission/components/form-adopt-submission/form-adopt-submission';
import FormAddSubmission from '@app/domain/submission/components/form-add-submission/form-add-submission';
import Page from '@app/components/page/page';
import Modal from '@app/components/modal/modal';
import Loader from '@app/components/loader/loader';
import useProjectShowQuery from '@app/data/project/use-project-show-query';
import useProjectSubmissionShowQuery from '@app/data/project/use-project-submission-show-query';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const SubmissionShow = () => {
    const [isAddSubmissionModalOpen, setIsAddSubmissionModalOpen] =
        useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const { submissionId } = useParams();

    const { isLoading: isProjectDataLoading, data: project } =
        useProjectShowQuery(projectSlug);
    const { isLoading: isSubmissionDataLoading, data: submissionData } =
        useProjectSubmissionShowQuery(projectSlug, submissionId);

    const closeAddSubmissionModal = () =>
        isFormChanged
            ? setOpenAlertBox(true)
            : setIsAddSubmissionModalOpen(false);

    if (isProjectDataLoading || isSubmissionDataLoading) {
        return <Loader white fixed />;
    }

    return (
        <Fragment>
            <Subheader>
                <Subheader.Left>
                    <NavLink to="/submissions" className="btn-back">
                        Go Back
                    </NavLink>
                    <span className="subheader__divider" />
                    <strong>Submission Details</strong>
                </Subheader.Left>
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
            <Page color="gray">
                <div className="flex-row">
                    <div className="flex-col flex-col--two-third">
                        <FormUpdateSubmission
                            submission={submissionData}
                            project={project}
                        />
                    </div>
                    <div
                        className={classNames('flex-col flex-col--one-third', {
                            'is-hidden': submissionData.status === 'denied',
                        })}
                    >
                        <FormAdoptSubmission
                            submission={submissionData}
                            project={project}
                        />
                    </div>
                </div>
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
                    />
                </Modal.Content>
            </Modal>
        </Fragment>
    );
};

export default SubmissionShow;

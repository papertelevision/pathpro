/**
 * External dependencies
 */
import React, { Fragment, useState } from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import FormEditFeature from '@app/domain/feature/components/form-edit-feature/form-edit-feature';
import FormConfirmFeature from '@app/domain/feature/components/form-confirm-feature/form-confirm-feature';
import useFeatureShowQuery from '@app/data/feature/use-feature-show-query';

const FeatureModals = ({
    project,
    featureTypesData,
    selectedFeatureId,
    setSelectedFeatureId,
    openAlertBox,
    setOpenAlertBox,
    isEditFeatureModalOpen,
    setIsEditFeatureModalOpen,
    closeEditFeatureModal,
    setIsFormChanged,
    modalRedirectUrl,
    isConfirmFeatureModalOpen,
    setIsConfirmFeatureModalOpen,
    closeConfirmFeatureModal,
}) => {
    const [sortCommentsBy, setSortCommentsBy] = useState();

    const { data: featureData, isLoading: isFeatureDataLoading } =
        useFeatureShowQuery(selectedFeatureId, {
            enabled: !!selectedFeatureId,
        });

    if (isFeatureDataLoading) {
        return null;
    }

    return (
        <Fragment>
            <Modal
                className="full-height"
                modalIsOpen={isEditFeatureModalOpen}
                setIsModalOpen={setIsEditFeatureModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeEditFeatureModal}
                urlAddress={modalRedirectUrl}
            >
                <Modal.Content>
                    {isEditFeatureModalOpen && (
                        <FormEditFeature
                            feature={featureData.data}
                            types={featureTypesData}
                            project={project}
                            setSortCommentsBy={setSortCommentsBy}
                            sortCommentsBy={sortCommentsBy}
                            closeModal={closeEditFeatureModal}
                            setIsFormChanged={setIsFormChanged}
                            setIsEditFeatureModalOpen={
                                setIsEditFeatureModalOpen
                            }
                            setIsConfirmFeatureModalOpen={
                                setIsConfirmFeatureModalOpen
                            }
                            setSelectedFeatureId={setSelectedFeatureId}
                            overallRank={featureData.overall_rank}
                            modalRedirectUrl={modalRedirectUrl}
                        />
                    )}
                </Modal.Content>
            </Modal>
            <Modal
                className="full-height"
                modifier="confirm-item"
                modalIsOpen={isConfirmFeatureModalOpen}
                setIsModalOpen={setIsConfirmFeatureModalOpen}
                isAlertBoxActive={openAlertBox}
                setOpenAlertBox={setOpenAlertBox}
                closeModal={closeConfirmFeatureModal}
                urlAddress="/features"
            >
                <Modal.Content>
                    {isConfirmFeatureModalOpen && (
                        <FormConfirmFeature
                            feature={featureData?.data}
                            project={project}
                            closeModal={closeConfirmFeatureModal}
                            setIsFormChanged={setIsFormChanged}
                            setIsConfirmFeatureModalOpen={
                                setIsConfirmFeatureModalOpen
                            }
                            setSelectedFeatureId={setSelectedFeatureId}
                            overallRank={featureData?.overall_rank}
                        />
                    )}
                </Modal.Content>
            </Modal>
        </Fragment>
    );
};

export default FeatureModals;

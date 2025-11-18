/**
 * External dependencies
 */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * Internal dependencies
 */
import Group from '@app/components/group/group';
import GroupHeader from '@app/components/group/group-header';
import GroupHeaderIcon from '@app/components/group/group-header-icon';
import GroupHeaderTitle from '@app/components/group/group-header-title';
import Filter from '@app/components/filter/filter';
import FormEditFeatureGroup from '@app/domain/feature-group/components/form-edit-feature-group/form-edit-feature-group';
import ButtonIcon from '@app/components/button/button-icon';
import FeatureGroupInfo from '../feature-group-info/feature-group-info';
import Modal from '@app/components/modal/modal';
import Icon from '@app/components/icon/icon';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { dateFormat } from '@app/lib/date-format';

const FeatureGroup = ({
    project,
    featureGroup,
    featureTypes,
    filterValue,
    setFilterValue,
    isInfoSectionVisible,
    setIsInfoSectionVisible,
    setFeatureGroupHeight,
}) => {
    const groupRef = useRef();
    const infoRef = useRef();

    const [isEditFeatureGroupModalOpen, setIsEditFeatureGroupModalOpen] =
        useState(false);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const { canUpdateProject, isAuthUserAdmitOrTeamMember } =
        usePermissionsContextApi();
    const navigate = useNavigate();

    const closeEditFeatureGroupModal = () => {
        if (isFormChanged) {
            setOpenAlertBox(true);
        } else {
            setIsEditFeatureGroupModalOpen(false);
        }
    };

    useEffect(() => {
        if (groupRef.current && infoRef.current) {
            setFeatureGroupHeight(
                isInfoSectionVisible
                    ? groupRef.current.clientHeight +
                          infoRef.current.clientHeight
                    : groupRef.current.clientHeight
            );
        }
    }, [groupRef, infoRef, isInfoSectionVisible]);

    const userHasEditPermissions = canUpdateProject(
        featureGroup.data.project_id
    );

    return (
        <Fragment>
            <Group ref={groupRef}>
                <GroupHeader color={featureGroup.data.header_color}>
                    <GroupHeader.Left>
                        <GroupHeaderIcon
                            iconUrl={featureGroup.data.icon_url}
                            predefinedIconType={featureGroup.data.icon_type}
                            predefinedIconIdentifier={featureGroup.data.icon_identifier}
                        />
                        <GroupHeaderTitle>
                            <span className="is-display-flex">
                                {featureGroup.data.title}
                            </span>
                            {isAuthUserAdmitOrTeamMember(
                                featureGroup.data.project_id
                            ) && (
                                <span>
                                    Updated:{' '}
                                    {dateFormat(
                                        featureGroup.data.updated_at,
                                        project.date_format,
                                        false,
                                        false,
                                        '/'
                                    )}
                                </span>
                            )}
                        </GroupHeaderTitle>
                    </GroupHeader.Left>
                    <GroupHeader.Right>
                        {featureGroup.filterValues.length > 1 && (
                            <Filter
                                tooltipText="Filter by type"
                                type="feature"
                                data={featureGroup.filterValues}
                                filterValue={filterValue}
                                setFilterValue={setFilterValue}
                                onChange={(value) =>
                                    navigate(
                                        `/features${
                                            value ? `?type=${value}` : ''
                                        }`
                                    )
                                }
                            />
                        )}
                        <button
                            className="group__header-button"
                            onClick={() =>
                                setIsInfoSectionVisible(!isInfoSectionVisible)
                            }
                        >
                            <Icon type="question" />
                        </button>
                        {userHasEditPermissions && (
                            <ButtonIcon
                                iconType="simple_pencil"
                                onClick={() =>
                                    setIsEditFeatureGroupModalOpen(true)
                                }
                            />
                        )}
                    </GroupHeader.Right>
                </GroupHeader>
            </Group>
            <FeatureGroupInfo
                ref={infoRef}
                isVisible={isInfoSectionVisible}
                setIsVisible={setIsInfoSectionVisible}
                featureTypes={featureTypes}
            />
            {userHasEditPermissions && (
                <Modal
                    medium
                    className="full-height"
                    modalIsOpen={isEditFeatureGroupModalOpen}
                    setIsModalOpen={setIsEditFeatureGroupModalOpen}
                    isAlertBoxActive={openAlertBox}
                    setOpenAlertBox={setOpenAlertBox}
                    closeModal={closeEditFeatureGroupModal}
                >
                    <Modal.Content>
                        <Modal.Header closeModal={closeEditFeatureGroupModal}>
                            <div className="modal__header-left">
                                Edit Feature Group
                            </div>
                        </Modal.Header>

                        <FormEditFeatureGroup
                            featureGroup={featureGroup.data}
                            closeModal={closeEditFeatureGroupModal}
                            setIsFormChanged={setIsFormChanged}
                            setIsEditFeatureGroupModalOpen={
                                setIsEditFeatureGroupModalOpen
                            }
                        />
                    </Modal.Content>
                </Modal>
            )}
        </Fragment>
    );
};

export default FeatureGroup;

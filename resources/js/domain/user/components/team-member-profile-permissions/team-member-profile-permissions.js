/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import FormCheckbox from '@app/components/form/form-checkbox';
import FormToggle from '@app/components/form/form-toggle';
import Accordion from '@app/components/accordion/accordion';
import AccordionSection from '@app/components/accordion/accordion-section';
import AccordionHeader from '@app/components/accordion/accordion-header';
import AccordionBody from '@app/components/accordion/accordion-body';

const TeamMemberProfilePermissions = ({ userData }) => {
    const availablePermissions = userData.available_permissions;

    const handleRenderCheckbox = (
        index,
        availablePermission,
        userPermission
    ) => (
        <FormToggle
            key={availablePermission.value}
            id={`${availablePermission.value} ${index}`}
            name={`permission[${userPermission.project_id}][]`}
            value={availablePermission.value}
            description={availablePermission.label}
            defaultChecked={
                userPermission.permission.includes(availablePermission.value) ||
                userPermission.permission.includes('*')
            }
        />
    );

    return (
        <div className="user-row-content">
            <div className="user-row-content-header">
                <h3>User Permissions</h3>
                <Accordion active projectMemberPermissions>
                    {userData.permissions.map((userPermission, index) => (
                        <AccordionSection
                            index={index}
                            key={`${index} / ${userPermission.project_id}`}
                        >
                            <AccordionHeader project>
                                <AccordionHeader.Left>
                                    {userPermission.project_title}
                                </AccordionHeader.Left>
                            </AccordionHeader>
                            <AccordionBody index={index}>
                                <div className="holder-checkboxes">
                                    <div className="holder-checkboxes__left">
                                        <div className="holder-checkboxes__group">
                                            <h5>General</h5>
                                            {availablePermissions
                                                .slice(0, 4)
                                                .map((availablePermission) =>
                                                    handleRenderCheckbox(
                                                        index,
                                                        availablePermission,
                                                        userPermission
                                                    )
                                                )}
                                        </div>
                                    </div>
                                    <div className="holder-checkboxes__right">
                                        <div className="holder-checkboxes__group">
                                            <h5>Advanced</h5>
                                            {availablePermissions
                                                .slice(4, 7)
                                                .map((availablePermission) =>
                                                    handleRenderCheckbox(
                                                        index,
                                                        availablePermission,
                                                        userPermission
                                                    )
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </AccordionBody>
                        </AccordionSection>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default TeamMemberProfilePermissions;

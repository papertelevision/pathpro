/**
 * External dependencies
 */
import React from 'react';

const ProjectItemGroup = ({ children, ...props }) => (
    <div className="project__item-group" {...props}>
        {children}
    </div>
);

export default ProjectItemGroup;

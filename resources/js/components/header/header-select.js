/**
 * External dependencies
 */
import React from 'react';
import { useLocation, useParams } from 'react-router';
import Select from 'react-select';

/**
 * Internal dependencies
 */
import { useQueryContextApi } from '@app/lib/query-context-api';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { handleHeaderSelectOptions } from '@app/lib/header/handle-header-select-options';

const indexOption = {
    label: 'All Projects',
};

const submissionsPages = ['submission', 'submissions'];
const teamPages = ['community-members', 'team-members', 'banned-members'];
const headerSettingsPage = ['header-settings'];

const HeaderSelect = () => {
    const params = useParams();
    const location = useLocation();
    const currentPathname = location.pathname;
    const { projects } = useQueryContextApi();
    const {
        authUser,
        canUpdateProject,
        canEditCustomHeader,
        isAuthUserAdmitOrTeamMember,
        isAuthUserAdminOrTeamMemberToAnyProjects,
    } = usePermissionsContextApi();
    const { selectedValue, setSelectedValue } = useHeaderSelectContext();

    if (!projects) {
        return null;
    }

    const handleOnChange = (e) => {
        setSelectedValue(e.value);
        handleHeaderSelectOptions(
            e.value,
            e.label === indexOption.label,
            location,
            params
        );
    };

    let options = projects.map((project) => ({
        label: project.title,
        value: project.slug,
    }));

    if (submissionsPages.some((page) => currentPathname.includes(page))) {
        options = options.filter((project) =>
            isAuthUserAdmitOrTeamMember(null, project.value)
        );
    }

    if (
        teamPages.some((page) => currentPathname.includes(page)) ||
        params?.userId
    ) {
        options = options.filter((project) =>
            canUpdateProject(null, project.value)
        );
    }

    if (currentPathname.includes(headerSettingsPage)) {
        options = options.filter((project) =>
            canEditCustomHeader(null, project.value)
        );
    }

    if (isAuthUserAdminOrTeamMemberToAnyProjects || authUser.has_plan) {
        options = [
            {
                label: indexOption.label,
                value: indexOption.value,
            },
            ...options,
        ];
    }

    const value = selectedValue
        ? options.filter((opt) => opt.value === selectedValue)
        : options[0];

    return (
        <Select
            value={value}
            id="projectsSelect"
            className="header-select"
            classNamePrefix="header-select"
            dropdownIndicator={false}
            options={options}
            onChange={handleOnChange}
            isSearchable={false}
            data-tooltip-id="tooltip"
            data-tooltip-variant="light"
            noOptionsMessage={() => 'No projects'}
        />
    );
};

export default HeaderSelect;

/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router';
import qs from 'qs';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const FilterSelect = ({
    filterValue,
    title,
    id,
    name,
    dynamicData,
    ranks,
    statuses,
    currentTableFilterValue,
    setCurrentTableFilterValue,
}) => {
    const location = useLocation();
    const { rank } = qs.parse(location?.search, { ignoreQueryPrefix: true });
    const navigate = useNavigate();
    let uniqueValues = [];

    if (title === 'Filter by Author') {
        uniqueValues = dynamicData.map((item) => ({
            value: item[filterValue],
            label: item[filterValue],
        }));
    } else if (title === 'Filter by Status') {
        uniqueValues = statuses.map((item) => ({
            value: item.value,
            label: item.label,
        }));
    } else if (title === 'Filter by Rank') {
        uniqueValues = ranks.map((rank) => ({
            value: rank.value,
            label: rank.label,
        }));
    }

    uniqueValues.unshift({
        value: 'All',
        label: 'All',
    });

    const handleSelectValue = (e) => {
        setCurrentTableFilterValue(e);
        handleOtherFilters(e.value);
    };

    const handleOtherFilters = (urlValue) => {
        if (title === 'Filter by Author') {
            if (name === 'newsAuthorFilter') {
                navigate(`/news?author=${urlValue}&status=All`);
            } else if (name === 'releaseNotesAuthorFilter') {
                navigate(`/release-notes?author=${urlValue}&status=All`);
            }
        } else if (title === 'Filter by Status') {
            projectSlug
                ? navigate(`/submissions?status=${urlValue}`)
                : navigate(`/submissions?status=${urlValue}`);
        } else if (title === 'Filter by Rank') {
            projectSlug
                ? navigate(`/community-members?rank=${urlValue}`)
                : navigate(`/community-members?rank=${urlValue}`);
        }
    };

    useEffect(() => {
        if (!currentTableFilterValue && !rank) {
            setCurrentTableFilterValue({
                value: 'All',
                label: 'All',
            });
        } else if (rank) {
            let currentRank = uniqueValues.find((item) => item.value === rank);
            currentRank && setCurrentTableFilterValue(currentRank);
        }
    }, [rank]);

    return (
        <div className="filter-select__wrapper">
            {title && <label htmlFor={id}>{title}</label>}

            <Select
                name={name}
                classNamePrefix="filter-select"
                value={currentTableFilterValue}
                options={uniqueValues}
                onChange={handleSelectValue}
                isSearchable={false}
            />
        </div>
    );
};

export default FilterSelect;

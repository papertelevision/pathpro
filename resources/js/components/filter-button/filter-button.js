/**
 * External dependencies
 */
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

const FilterButton = ({ data, filterValue, buttonValue, value, label }) => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const author = search.substring(
        search.indexOf('=') + 1,
        search.lastIndexOf('&')
    );

    const handleOnClick = (e) => {
        if (filterValue === 'releaseNotes') {
            navigate(
                `/release-notes/?author=${author || 'All'}&status=${
                    e.target.value
                }`
            );
        } else if (filterValue === 'news') {
            navigate(`/news/?author=${author || 'All'}&status=${value}`);
        }
    };

    const handleCurrentFilterValueCount = (value) => {
        if (value === 'All') {
            return data.meta.allTotals;
        } else if (value === 'Published') {
            return data.meta.publishedTotals;
        } else if (value === 'Draft') {
            return data.meta.draftTotals;
        } else if (value === 'Live') {
            return data.meta.liveTotals;
        } else if (value === 'Archived') {
            return data.meta.archivedTotals;
        } else if (value === 'Trash') {
            return data.meta.deletedTotals;
        }
    };

    return (
        <div className="filter-button__wrapper">
            <button
                className="filter-button"
                onClick={handleOnClick}
                value={value ?? buttonValue}
            >
                {label
                    ? label
                    : `${buttonValue} (${handleCurrentFilterValueCount(
                          buttonValue
                      )})`}
            </button>
        </div>
    );
};

export default FilterButton;

/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

/**
 * Comments filter values.
 */
const commentsFilterValues = [
    {
        value: 'is_comment_pinned_to_top',
        label: 'Most Recent',
    },
    {
        value: 'is_comment_highlighted',
        label: 'Highlighted',
    },
    {
        value: 'upvotes_count',
        label: 'Most Popular',
    },
];

const CommentsFilter = ({
    setSortCommentsBy,
    sortCommentsBy = commentsFilterValues[0].value,
    ...props
}) => {
    const [selectedFilter, setSelectedFilter] = useState();

    const handleSelectFilter = (filterValue) => {
        setSelectedFilter(filterValue);
        setSortCommentsBy(filterValue.value);
    };

    useEffect(() => {
        setSelectedFilter(
            commentsFilterValues.filter((item) => item.value === sortCommentsBy)
        );
    }, [sortCommentsBy]);

    return (
        <Select
            className="comments-filter"
            classNamePrefix="comments-filter"
            options={commentsFilterValues}
            value={selectedFilter}
            onChange={handleSelectFilter}
            isSearchable={false}
            components={{
                IndicatorSeparator: () => null,
            }}
            placeholder={false}
            {...props}
        />
    );
};

export default CommentsFilter;

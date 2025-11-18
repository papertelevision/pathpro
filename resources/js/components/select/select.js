/**
 * External dependencies
 */
import React from 'react';
import ReactSelect from 'react-select';

const Select = ({ setValue, defaultValue, value, data }) => {
    const handleOnChange = (e) => {
        setValue(
            defaultValue.value === e.value
                ? null
                : {
                      label: e.label,
                      value: e.value,
                  }
        );
    };

    const options = data.map((item) => ({
        label: item.title,
        value: item.slug,
    }));

    return (
        <ReactSelect
            className="select"
            classNamePrefix="select"
            value={value || defaultValue}
            options={[defaultValue, ...options]}
            onChange={handleOnChange}
            isSearchable={false}
        />
    );
};

export default Select;

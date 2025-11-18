/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormContext } from 'react-hook-form';

const DatePicker = ({
    id,
    title,
    dateFormat,
    endDateName,
    selectsRange,
    startDateName,
}) => {
    const {
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useFormContext();

    const errorMessage = errors[startDateName]
        ? errors[startDateName]?.message
        : null;

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const handleOnChange = (date) => {
        selectsRange
            ? handleSelectDatesRange(date)
            : handleSelectSingleDate(date);
    };

    const handleSelectSingleDate = (date) => {
        setValue(startDateName, date);
        setValue(endDateName, date);
    };

    const handleSelectDatesRange = (date) => {
        const [start, end] = date;

        setValue(startDateName, start);
        setValue(endDateName, end);
    };

    const useDateFormat = () => {
        switch (dateFormat) {
            case 'us':
                return 'MM/d/yyyy';
            case 'uk':
                return 'd/MM/yyyy';
            case 'other':
                return 'yyyy/MM/d';
            default:
                return 'MM/d/yyyy';
        }
    };

    useEffect(() => {
        setStartDate(getValues(startDateName));
        setEndDate(getValues(endDateName));
    }, [watch(startDateName), watch(endDateName)]);

    return (
        <div className="react-datepicker-main">
            {title && <label htmlFor={id}>{title}</label>}

            <ReactDatePicker
                dateFormat={useDateFormat()}
                placeholderText="Please Select..."
                todayButton="Current date"
                showPopperArrow={false}
                minDate={new Date()}
                onChange={(date) => handleOnChange(date)}
                onKeyDown={(e) => {
                    e.preventDefault();
                }}
                selected={startDate}
                selectsStart
                startDate={selectsRange && startDate}
                endDate={selectsRange && endDate}
                selectsRange={selectsRange}
            />

            {errorMessage && (
                <div className="react-datepicker__error-message">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default DatePicker;

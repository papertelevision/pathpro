/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

/**
 * Internal dependencies
 */
import Button from '@app/components/button/button';

const BulkActionsSelect = ({
    data,
    title,
    id,
    bulkAction,
    actionLabel = 'Delete',
    isAnyCheckBoxChecked,
}) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedRowsItemsIDs, setSelectedRowsItemsIDs] = useState();

    const handleSelectAction = (e) => {
        const items = data
            .map((item) => {
                if (
                    item.isSelected &&
                    item.original.trash !== 'Trash' &&
                    !item.original?.deleted
                )
                    return item.original.id;
            })
            .filter((item) => item);

        setSelectedRowsItemsIDs(items);

        isAnyCheckBoxChecked ? setSelectedValue(e) : setSelectedValue(null);
    };

    const handleClickApplyButton = () => {
        bulkAction(selectedRowsItemsIDs);
        setSelectedValue(null);
    };

    useEffect(() => {
        !isAnyCheckBoxChecked && setSelectedValue(null);
    }, [isAnyCheckBoxChecked]);

    return (
        <div
            className="bulk-actions-select__wrapper"
            {...(!isAnyCheckBoxChecked && {
                'data-tooltip-id': 'tooltip',
                'data-tooltip-place': 'bottom',
                'data-tooltip-variant': 'light',
                'data-tooltip-content':
                    'Please select item(s) below to bulk edit',
                'data-tooltip-float': true,
            })}
        >
            {title && <label htmlFor={id}>{title}</label>}
            <Select
                classNamePrefix="bulk-actions-select"
                value={selectedValue}
                options={[
                    {
                        value: 'action',
                        label: actionLabel,
                    },
                ]}
                onChange={handleSelectAction}
                isSearchable={false}
                isDisabled={!isAnyCheckBoxChecked}
            />
            <Button
                type="button"
                rounded
                color="white"
                disabled={!selectedValue}
                onClick={() => handleClickApplyButton()}
            >
                Apply
            </Button>
        </div>
    );
};

export default BulkActionsSelect;

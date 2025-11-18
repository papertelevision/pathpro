/**
 * External dependencies
 */
import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { PREDEFINED_ICONS, getIconDataById } from '@app/lib/heroicons-library';

const FormIconSelector = ({ value, onChange, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const selectedIcon = value ? getIconDataById(value) : null;

    // Filter icons based on search term
    const filteredIcons = searchTerm
        ? PREDEFINED_ICONS.filter(icon =>
              icon.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : PREDEFINED_ICONS;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleIconSelect = (iconId) => {
        onChange(iconId);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange(null);
    };

    const IconComponent = selectedIcon?.component;

    return (
        <div className="form__icon-selector" ref={dropdownRef}>
            <button
                type="button"
                className={classNames('form__icon-selector-trigger', {
                    'is-active': isOpen,
                    'is-disabled': disabled,
                    'has-value': selectedIcon,
                })}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <div className="form__icon-selector-trigger-content">
                    {selectedIcon ? (
                        <>
                            <div className="form__icon-selector-preview">
                                <IconComponent className="form__icon-selector-icon" />
                            </div>
                            <span className="form__icon-selector-label">
                                {selectedIcon.name}
                            </span>
                        </>
                    ) : (
                        <span className="form__icon-selector-placeholder">
                            Select an icon...
                        </span>
                    )}
                </div>
                <div className="form__icon-selector-actions">
                    {selectedIcon && (
                        <button
                            type="button"
                            className="form__icon-selector-clear"
                            onClick={handleClear}
                            title="Clear selection"
                        >
                            ×
                        </button>
                    )}
                    <span className="form__icon-selector-arrow">▼</span>
                </div>
            </button>

            {isOpen && (
                <div className="form__icon-selector-dropdown">
                    <div className="form__icon-selector-search">
                        <input
                            type="text"
                            placeholder="Search icons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="form__icon-selector-grid">
                        {filteredIcons.length > 0 ? (
                            filteredIcons.map((icon) => {
                                const Icon = icon.component;
                                return (
                                    <button
                                        key={icon.id}
                                        type="button"
                                        className={classNames(
                                            'form__icon-selector-option',
                                            {
                                                'is-selected': value === icon.id,
                                            }
                                        )}
                                        onClick={() => handleIconSelect(icon.id)}
                                        title={icon.name}
                                    >
                                        <Icon className="form__icon-selector-option-icon" />
                                        <span className="form__icon-selector-option-name">
                                            {icon.name}
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="form__icon-selector-empty">
                                No icons found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                    <div className="form__icon-selector-footer">
                        {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormIconSelector;

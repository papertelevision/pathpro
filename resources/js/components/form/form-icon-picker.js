/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import FormIconSelector from './form-icon-selector';

const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];

const FormIconPicker = ({
    title = 'Icon',
    buttonText = 'Upload Icon',
    name,
    setIcon,
    iconUrl,
    iconData,
    modifier,
    // New props for predefined icons
    predefinedIconId,
    onPredefinedIconChange,
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const errorMessage = errors[name] ? errors[name]?.message : null;

    const [fileData, setFileData] = useState({
        file: null,
        imgSrc: '',
    });
    const [isExistingIconCleared, setIsExistingIconCleared] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (allowedTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setIcon(file);
                    setFileData({
                        file: file,
                        imgSrc: event.target.result,
                    });
                    setIsExistingIconCleared(true);
                    // Clear predefined icon when uploading
                    if (onPredefinedIconChange) {
                        onPredefinedIconChange(null);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                alert('Invalid file type. Please select a valid image file.');
            }
        }
    };

    const handlePredefinedIconSelect = (iconId) => {
        if (onPredefinedIconChange) {
            onPredefinedIconChange(iconId);
        }
        // Clear uploaded file when selecting predefined icon
        if (iconId) {
            setFileData({
                file: null,
                imgSrc: '',
            });
            setIcon(null);
            setIsExistingIconCleared(true);
        }
    };

    const handleRemoveUploadedIcon = () => {
        setFileData({
            file: null,
            imgSrc: '',
        });
        setIcon(null);
        setIsExistingIconCleared(true);
        // This will allow selecting predefined icons again
    };

    const hasUploadedFile = fileData.file !== null;
    const hasExistingIcon = iconUrl && !predefinedIconId && !hasUploadedFile && !isExistingIconCleared;

    return (
        <div className="form__default">
            <div
                className={classNames('form-icon-picker', {
                    [`form-icon-picker--${modifier}`]: modifier,
                })}
            >
                <label>{title}</label>

                {/* Predefined Icon Selector - Only show if predefined icons are enabled */}
                {onPredefinedIconChange && (
                    <>
                        <div className="form-icon-picker__section">
                            <div className="form-icon-picker__section-label">
                                Select from library
                            </div>
                            <FormIconSelector
                                value={predefinedIconId}
                                onChange={handlePredefinedIconSelect}
                                disabled={hasUploadedFile || hasExistingIcon}
                            />
                        </div>

                        {/* Divider */}
                        <div className="form-icon-picker__divider">
                            <span>OR</span>
                        </div>
                    </>
                )}

                {/* File Upload Section */}
                <div className="form-icon-picker__section">
                    {onPredefinedIconChange && (
                        <div className="form-icon-picker__section-label">
                            Upload your own
                        </div>
                    )}
                    <div className="form-icon-picker__upload-wrapper">
                        <div className={classNames('form-icon-picker__upload', {
                            'is-disabled': predefinedIconId,
                        })}>
                            {hasUploadedFile ? (
                                <>
                                    <img src={fileData.imgSrc} alt="Icon" />
                                    <strong>{fileData.file?.name}</strong>
                                    <span>Change</span>
                                </>
                            ) : hasExistingIcon ? (
                                <>
                                    <img src={iconUrl} alt="Icon" />
                                    <strong>{iconData.file_name}</strong>
                                    <span>Change</span>
                                </>
                            ) : (
                                <span>{buttonText}</span>
                            )}
                            <input
                                {...register(name)}
                                type="file"
                                accept=".png, .jpg, .jpeg, .gif, .webp, .svg"
                                onChange={handleFileChange}
                                disabled={!!predefinedIconId}
                            />
                        </div>
                        {(hasUploadedFile || hasExistingIcon) && (
                            <button
                                type="button"
                                className="form-icon-picker__remove"
                                onClick={handleRemoveUploadedIcon}
                                title="Remove uploaded icon"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {errorMessage && (
                    <div className="form__field-error-message">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormIconPicker;

/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';

const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];

const InputUploadFile = ({
    title,
    name,
    uploadedFile,
    setUploadedFile,
    disabled,
    user,
    ...props
}) => {
    const { register } = useFormContext();
    const [imageSrc, setImageSrc] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (allowedTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setUploadedFile(file);
                    setImageSrc(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Invalid file type. Please select a valid image file.');
            }
        }
    };

    // Check if we have a custom avatar (not the default user-default-img.png)
    const hasCustomAvatar = (imageSrc || uploadedFile) &&
                           !(uploadedFile && uploadedFile.includes('user-default-img.png'));

    return (
        <div
            className={classNames('input-upload-file', {
                'disabled': disabled,
                'pointer-events-none': disabled,
            })}
        >
            <strong>{title}</strong>
            {hasCustomAvatar ? (
                <img src={imageSrc || uploadedFile} alt={name} />
            ) : (
                <div className="input-upload-file__initials">
                    {user?.username?.charAt(0).toUpperCase() || '?'}
                </div>
            )}
            <input
                name={name}
                type="file"
                {...register(name)}
                {...props}
                accept=".png, .jpg, .jpeg, .gif, .webp, .svg"
                onChange={handleFileChange}
            />
            {!disabled && <Icon type="pencil" />}
        </div>
    );
};

export default InputUploadFile;

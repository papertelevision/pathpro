/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const FormInlineFileUpload = ({
    name = 'attachments',
    maxFiles = 5,
    maxSizeMB = 3,
    uniqueId = null,
}) => {
    const { setValue, watch } = useFormContext();
    const currentFiles = watch(name) || [];
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const inputId = uniqueId ? `inline-file-${uniqueId}` : `inline-file-${name}-${Date.now()}`;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const totalFiles = currentFiles.length + files.length;

        // Check max files limit
        if (totalFiles > maxFiles) {
            alert(`You can only upload up to ${maxFiles} files.`);
            return;
        }

        // Check file sizes
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        const invalidFiles = files.filter((file) => file.size > maxSizeBytes);

        if (invalidFiles.length > 0) {
            alert(
                `Some files exceed the ${maxSizeMB}MB size limit: ${invalidFiles.map((f) => f.name).join(', ')}`
            );
            return;
        }

        // Update form value
        const updatedFiles = [...currentFiles, ...files];
        setValue(name, updatedFiles, { shouldDirty: true, shouldValidate: true });

        // Reset file input
        setFileInputKey(Date.now());
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = currentFiles.filter((_, i) => i !== index);
        setValue(name, updatedFiles, { shouldDirty: true, shouldValidate: true });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

        if (imageExts.includes(ext)) return '🖼️';
        if (ext === 'pdf') return '📄';
        if (['doc', 'docx'].includes(ext)) return '📝';
        if (['xls', 'xlsx'].includes(ext)) return '📊';
        return '📎';
    };

    return (
        <div className="inline-file-upload">
            <input
                key={fileInputKey}
                type="file"
                id={inputId}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.svg"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <label
                htmlFor={inputId}
                className="inline-file-upload__trigger"
                title="Attach files"
            >
                📎
            </label>

            {currentFiles.length > 0 && (
                <div className="inline-file-upload__list">
                    {currentFiles.map((file, index) => (
                        <div key={index} className="inline-file-upload__chip">
                            <span className="inline-file-upload__chip-icon">
                                {getFileIcon(file.name)}
                            </span>
                            <span className="inline-file-upload__chip-name">
                                {file.name}
                            </span>
                            <span className="inline-file-upload__chip-size">
                                ({formatFileSize(file.size)})
                            </span>
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="inline-file-upload__chip-remove"
                                aria-label="Remove file"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormInlineFileUpload;

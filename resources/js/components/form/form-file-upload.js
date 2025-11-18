/**
 * External dependencies
 */
import React, { useState } from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';

const FormFileUpload = ({
    id,
    name,
    title,
    description,
    marginBottom,
    accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.svg',
    maxFiles = 5,
    maxSizeMB = 3,
    existingAttachments = [],
    onDeleteExisting,
}) => {
    const {
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const [fileList, setFileList] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const errorMessage = errors[name] ? errors[name]?.message : null;
    const currentFiles = watch(name) || [];
    const totalCount = existingAttachments.length + currentFiles.length;

    const handleDeleteExisting = async (attachmentId) => {
        if (!window.confirm('Are you sure you want to delete this attachment?')) {
            return;
        }

        try {
            await axios.delete(`/api/attachments/${attachmentId}`);
            if (onDeleteExisting) {
                onDeleteExisting(attachmentId);
            }
        } catch (error) {
            console.error('Error deleting attachment:', error);
            alert('Failed to delete attachment. Please try again.');
        }
    };

    const processFiles = (files) => {
        const fileArray = Array.from(files);
        const totalFiles = existingAttachments.length + currentFiles.length + fileArray.length;

        // Check max files limit
        if (totalFiles > maxFiles) {
            alert(`You can only upload up to ${maxFiles} files.`);
            return;
        }

        // Check file sizes
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        const invalidFiles = fileArray.filter((file) => file.size > maxSizeBytes);

        if (invalidFiles.length > 0) {
            alert(
                `Some files exceed the ${maxSizeMB}MB size limit: ${invalidFiles.map((f) => f.name).join(', ')}`
            );
            return;
        }

        // Update form value
        const updatedFiles = [...currentFiles, ...fileArray];
        setValue(name, updatedFiles, { shouldDirty: true, shouldValidate: true });

        // Update preview list
        setFileList([...fileList, ...fileArray]);
    };

    const handleFileChange = (e) => {
        processFiles(e.target.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = currentFiles.filter((_, i) => i !== index);
        setValue(name, updatedFiles, { shouldDirty: true, shouldValidate: true });
        setFileList(fileList.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (fileName, mimeType = null) => {
        // If mime type is provided (existing attachments), use it
        if (mimeType) {
            if (mimeType.startsWith('image/')) return '🖼️';
            if (mimeType === 'application/pdf') return '📄';
            if (
                mimeType === 'application/msword' ||
                mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
                return '📝';
            if (
                mimeType === 'application/vnd.ms-excel' ||
                mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
                return '📊';
            return '📎';
        }

        // Otherwise use file extension (new uploads)
        const ext = fileName.split('.').pop().toLowerCase();
        const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

        if (imageExts.includes(ext)) return '🖼️';
        if (ext === 'pdf') return '📄';
        if (['doc', 'docx'].includes(ext)) return '📝';
        if (['xls', 'xlsx'].includes(ext)) return '📊';
        return '📎';
    };

    return (
        <div
            className={classNames('form__default form__file-upload', {
                'margin-bottom': marginBottom,
            })}
        >
            <div
                className={classNames('attachment-list', {
                    'is-dragging': isDragging,
                })}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id={id}
                    name={name}
                    accept={accept}
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <div className="attachment-list__header">
                    <span className="attachment-list__title">
                        📎 Attachments ({totalCount})
                    </span>
                    <span className="attachment-list__subtitle">
                        Visible to Admin & Team Members only
                    </span>
                </div>

                {(existingAttachments.length > 0 || currentFiles.length > 0) && (
                    <div className="attachment-list__items">
                        {/* Existing attachments from database */}
                        {existingAttachments.map((attachment) => (
                            <div key={`existing-${attachment.id}`} className="attachment-list__item">
                                <span className="attachment-list__item-icon">
                                    {getFileIcon(attachment.file_name, attachment.mime_type)}
                                </span>
                                <div className="attachment-list__item-info">
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="attachment-list__item-name"
                                    >
                                        {attachment.file_name}
                                    </a>
                                    <span className="attachment-list__item-size">
                                        {formatFileSize(attachment.size)}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteExisting(attachment.id)}
                                    className="attachment-list__item-delete"
                                    aria-label="Delete attachment"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* New files being uploaded */}
                        {currentFiles.map((file, index) => (
                            <div key={`new-${index}`} className="attachment-list__item">
                                <span className="attachment-list__item-icon">
                                    {getFileIcon(file.name)}
                                </span>
                                <div className="attachment-list__item-info">
                                    <span className="attachment-list__item-name">
                                        {file.name}
                                    </span>
                                    <span className="attachment-list__item-size">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="attachment-list__item-delete"
                                    aria-label="Remove file"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <label htmlFor={id} className="form__file-upload-link">
                    Drop file here or click to upload
                </label>
            </div>

            {errorMessage && (
                <div className="form__field-error-message">{errorMessage}</div>
            )}
        </div>
    );
};

export default FormFileUpload;

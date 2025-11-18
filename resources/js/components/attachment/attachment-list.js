/**
 * External dependencies
 */
import React from 'react';
import axios from 'axios';

const AttachmentList = ({ attachments, onDelete, canDelete = false, showSubtitle = true }) => {
    if (!attachments || attachments.length === 0) {
        return null;
    }

    const handleDelete = async (attachmentId) => {
        if (!window.confirm('Are you sure you want to delete this attachment?')) {
            return;
        }

        try {
            await axios.delete(`/api/attachments/${attachmentId}`);
            if (onDelete) {
                onDelete(attachmentId);
            }
        } catch (error) {
            console.error('Error deleting attachment:', error);
            alert('Failed to delete attachment. Please try again.');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType, fileName) => {
        if (mimeType.startsWith('image/')) return '🖼️';
        if (mimeType === 'application/pdf') return '📄';
        if (
            mimeType === 'application/msword' ||
            mimeType ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
            return '📝';
        if (
            mimeType === 'application/vnd.ms-excel' ||
            mimeType ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
            return '📊';
        return '📎';
    };

    return (
        <div className="attachment-list">
            <div className="attachment-list__header">
                <span className="attachment-list__title">
                    📎 Attachments ({attachments.length})
                </span>
                {showSubtitle && (
                    <span className="attachment-list__subtitle">
                        Visible to Admin & Team Members only
                    </span>
                )}
            </div>
            <div className="attachment-list__items">
                {attachments.map((attachment) => (
                    <div key={attachment.id} className="attachment-list__item">
                        <span className="attachment-list__item-icon">
                            {getFileIcon(attachment.mime_type, attachment.file_name)}
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
                        {canDelete && (
                            <button
                                type="button"
                                onClick={() => handleDelete(attachment.id)}
                                className="attachment-list__item-delete"
                                aria-label="Delete attachment"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttachmentList;

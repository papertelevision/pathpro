/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import Button from '@app/components/button/button';
import Icon from '@app/components/icon/icon';
import { useQueryContextApi } from '@app/lib/query-context-api';

const ModalConfirmDiscoverMore = ({ closeModal }) => {
    const { navigation } = useQueryContextApi();

    const knowledgeBaseLink = navigation.find(
        (item) => item.type === 'knowledge-base-link'
    )?.value;

    return (
        <Modal.Content>
            <div className="modal__content-wrapper">
                <div className="modal__content-icon">
                    <Icon type="high_five" />
                </div>
                <div className="modal__content-text">
                    <h3>Feature / Task Added!</h3>
                    <p>
                        Nice, you've added your first
                        <b> features, idea, or task</b> to a Task Group. <br />
                        That's everything you need to forge your path with
                        PathPro! You're all set to get started, or you can find
                        more tutorials below.
                    </p>
                </div>
                <div className="modal__content-button-wrapper">
                    <Button
                        type="button"
                        rounded
                        larger
                        color="blue"
                        onClick={() => window.open(knowledgeBaseLink, '_blank')}
                    >
                        Discover more PathPro tutorials
                    </Button>
                </div>
                <div className="modal__content-button-wrapper">
                    <Button type="button" color="red-text" onClick={closeModal}>
                        Close this window and get started!
                    </Button>
                </div>
            </div>
        </Modal.Content>
    );
};

export default ModalConfirmDiscoverMore;

/**
 * External dependencies
 */
import React from 'react';
import Cookies from 'js-cookie';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import Button from '@app/components/button/button';
import Icon from '@app/components/icon/icon';
import { useHeaderSelectContext } from '@app/lib/header/header-select-context';
import { useSubdomain } from '@app/lib/domain';

const ModalConfirmTaskGroup = ({ closeModal }) => {
    const { selectedValue: projectSlug } = useHeaderSelectContext();

    const afterConfirmTaskGroup = () => {
        window.history.replaceState({}, '');

        Cookies.set('openModal', true);

        window.location.href = useSubdomain(projectSlug);
    };

    return (
        <Modal.Content>
            <div className="modal__content-wrapper">
                <div className="modal__content-icon">
                    <Icon type="high_five" />
                </div>
                <div className="modal__content-text">
                    <h3>Project Created!</h3>
                    <p>
                        Now that you've added your project / product, it's the
                        perfect time to add your first <b>Task Group</b>. You
                        can do so below.
                    </p>
                </div>
                <div className="modal__content-button-wrapper">
                    <Button
                        type="button"
                        rounded
                        larger
                        color="blue"
                        onClick={() => afterConfirmTaskGroup()}
                    >
                        Add First Task Group
                    </Button>
                    <span>Recommended</span>
                </div>
                <div className="modal__content-button-wrapper">
                    <Button type="button" color="red-text" onClick={closeModal}>
                        Close this window and return to Projects
                    </Button>
                </div>
            </div>
        </Modal.Content>
    );
};

export default ModalConfirmTaskGroup;

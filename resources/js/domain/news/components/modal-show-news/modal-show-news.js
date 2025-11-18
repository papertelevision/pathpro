/**
 * External dependencies
 */
import React from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { useLocation, useNavigate } from 'react-router';

/**
 * Internal dependencies
 */
import Modal from '@app/components/modal/modal';
import Button from '@app/components/button/button';
import BoxButtonShare from '@app/components/box/box-button-share';
import { dateFormat } from '@app/lib/date-format';

const ModalShowNews = ({ isOpen = false, setIsOpen = () => {}, project }) => {
    const news = project.latest_news_update;
    const location = useLocation();
    const navigate = useNavigate();

    const handleClose = () => {
        setIsOpen(false);
        navigate(location.pathname.replace(/\/public-news\/\d+/g, '') || '/');
    };

    return (
        <Modal
            className="full-height"
            modifier="public"
            closeModal={handleClose}
            modalIsOpen={isOpen}
            setIsModalOpen={setIsOpen}
        >
            <Modal.Content>
                <Modal.Header closeModal={handleClose}>
                    <div className="modal__header-title">
                        <h1>{project.title} News</h1>
                        <i>
                            {dateFormat(
                                news.updated_at,
                                project.date_format,
                                false,
                                true
                            )}{' '}
                            | Author: @{news.author.username}
                        </i>
                    </div>
                </Modal.Header>
                <div className="modal__content-wrapper">
                    <h2>{news.title}</h2>
                    <div className="modal__content-parser">
                        {parse(
                            DOMPurify.sanitize(news.description, {
                                ADD_ATTR: ['target'],
                            })
                        )}
                    </div>
                    <div className="modal__content-actions">
                        <BoxButtonShare
                            shareUrl={`/public-news/${news.id}`}
                            shareObject="news update"
                            type="light"
                            place="bottom"
                            data-tooltip-attr="share"
                        />
                        <Button
                            type="button"
                            color="is-transparent"
                            modifier="rectangular"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default ModalShowNews;

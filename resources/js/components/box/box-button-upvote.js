7;
/**
 * External dependencies
 */
import React, { Fragment, useState } from 'react';
import { useQueryClient } from 'react-query';
import { debounce } from 'lodash';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';
import Modal from '@app/components/modal/modal';
import Button from '@app/components/button/button';
import BoxButton from '@app/components/box/box-button';
import useUpvoteStoreMutation from '@app/data/upvote/use-upvote-store-mutation';
import useUpvoteDestroyMutation from '@app/data/upvote/use-upvote-destroy-mutation';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const BoxButtonUpvote = ({
    project,
    showUpvotesCount = true,
    showUpvotesCountAfterText = false,
    showIcon = false,
    iconOnly = false,
    upvotable,
    upvotableType,
    invalidateQueries = [],
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const queryClient = useQueryClient();

    const { authUser, isUserLoggedIn, isAuthUserAssignToProject } =
        usePermissionsContextApi();
    const { mutate: mutateUpvoteStore } = useUpvoteStoreMutation(project.slug);
    const { mutate: mutateUpvoteDestroy } = useUpvoteDestroyMutation(
        project.slug
    );

    const cookieName =
        upvotableType === 'task'
            ? 'upvotedTaskId'
            : 'feature'
            ? 'upvotedFeatureId'
            : 'upvotedCommentId';

    const upvoteId = isUserLoggedIn
        ? upvotable?.upvotes.find((item) => item.author_id === authUser?.id)?.id
        : upvotable?.upvotes.find(
              (item) =>
                  item.uuid !== null &&
                  item.uuid ===
                      Cookies.get(`${cookieName}-${parseInt(upvotable.id)}`)
          )?.id;

    const handleUpvote = () => {
        if (upvoteId) {
            if (!isUserLoggedIn) {
                Cookies.remove(`${cookieName}-${upvoteId}`);
            }

            mutateUpvoteDestroy(upvoteId, {
                onSuccess: () => {
                    invalidateQueries.forEach((query) => {
                        queryClient.invalidateQueries(query);
                    });
                    setIsModalOpen(false);
                },
            });
        } else {
            const generatedId = uuidv4();
            const values = {
                upvotable_id: upvotable.id,
                upvotable_type: upvotableType,
                uuid: generatedId,
            };

            if (!isUserLoggedIn) {
                Cookies.set(`${cookieName}-${upvotable.id}`, generatedId);
            }

            mutateUpvoteStore(values, {
                onSuccess: () => {
                    invalidateQueries.forEach((query) => {
                        queryClient.invalidateQueries(query);
                    });
                    setIsModalOpen(false);
                },
            });
        }
    };

    const buttonText = () => {
        if (iconOnly) {
            // Only show count when upvoted
            return upvoteId ? upvotable.upvotes_count : null;
        } else if (showUpvotesCount) {
            return (
                <>
                    <b>{upvotable.upvotes_count}</b> Upvotes
                </>
            );
        } else if (showUpvotesCountAfterText) {
            return `Upvotes (${upvotable.upvotes_count})`;
        } else {
            return 'Upvote';
        }
    };

    const handleOnUpvoteButtonClick = () => {
        if (isUserLoggedIn && !isAuthUserAssignToProject(null, project.slug)) {
            setIsModalOpen(true);
        } else if (!isUserLoggedIn && !project.is_public_upvoting_allowed) {
            setIsModalOpen(true);
        } else {
            handleUpvote();
        }
    };

    return (
        <Fragment>
            <BoxButton
                modifier={iconOnly ? "upvote icon-only" : "upvote"}
                isBorderBlue={upvoteId}
                data-tooltip-id="tooltip"
                data-tooltip-content={`Click here to upvote this ${upvotableType}.`}
                data-tooltip-float
                data-tooltip-variant="light"
                data-tooltip-place="bottom"
                onClick={debounce(() => handleOnUpvoteButtonClick(), 500)}
                disabled={
                    !isAuthUserAssignToProject(null, project.slug) &&
                    upvotableType !== 'task' &&
                    upvotableType !== 'feature'
                }
            >
                {upvoteId ? (
                    <>
                        {showIcon && <Icon type="upvoted" />}
                        <strong>{buttonText()}</strong>
                    </>
                ) : (
                    <>
                        {showIcon && <Icon type="upvote" />}
                        <span>{buttonText()}</span>
                    </>
                )}
            </BoxButton>

            <Modal
                medium
                modifier="info"
                modalIsOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                closeModal={() => setIsModalOpen(false)}
            >
                <Modal.Content>
                    <Modal.Header
                        className="is-white"
                        closeModal={() => setIsModalOpen(false)}
                    >
                        <div className="modal__header-left"></div>
                    </Modal.Header>
                    <div className="modal__content-wrapper">
                        <div className="modal__content-text">
                            <p>
                                {isUserLoggedIn
                                    ? 'You must join the project as a community member in order to interact with it.'
                                    : 'You must create a free community member account or log in to an existing one to interact with this project.'}
                            </p>
                        </div>
                        <div className="modal__content-button-wrapper">
                            {isUserLoggedIn ? (
                                <Button
                                    type="button"
                                    color="blue"
                                    rounded
                                    larger
                                    onClick={() => handleUpvote()}
                                >
                                    Join Here 100% Free
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="button"
                                        color="blue"
                                        rounded
                                        larger
                                        onClick={() =>
                                            navigate('/login', {
                                                state: {
                                                    redirectTo: pathname,
                                                },
                                            })
                                        }
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        type="button"
                                        color="blue"
                                        rounded
                                        larger
                                        onClick={() =>
                                            navigate(
                                                `/register/${project.slug}`,
                                                {
                                                    state: {
                                                        redirectTo: pathname,
                                                    },
                                                }
                                            )
                                        }
                                    >
                                        Join Here 100% Free
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Modal.Content>
            </Modal>
        </Fragment>
    );
};

export default BoxButtonUpvote;

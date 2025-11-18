/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Icon from '@app/components/icon/icon';
import Loader from '@app/components/loader/loader';

const SuggestionIconCircle = ({
    status,
    handleAction,
    showHighlightCommentSpinner,
}) => {
    return (
        <div
            className={classNames('suggestion__icon-circle', {
                'is-green': status === 1,
            })}
        >
            <button type="button" onClick={(e) => handleAction(e)}>
                {showHighlightCommentSpinner ? (
                    <Loader gray />
                ) : (
                    <Icon type="highlight" />
                )}
            </button>
        </div>
    );
};

export default SuggestionIconCircle;

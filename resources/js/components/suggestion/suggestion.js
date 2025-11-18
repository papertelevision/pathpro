/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import SuggestionLeftCol from '@app/components/suggestion/suggestion-left-col';
import SuggestionRightCol from '@app/components/suggestion/suggestion-right-col';

const Suggestion = ({ children, isLeftBordered, suggestionRef, modifier }) => (
    <div
        className={classNames('suggestion', {
            'is-left-bordered': isLeftBordered,
            [`suggestion--${modifier}`]: modifier,
        })}
        ref={suggestionRef && suggestionRef}
    >
        {children}
    </div>
);

Suggestion.Left = SuggestionLeftCol;
Suggestion.Right = SuggestionRightCol;

export default Suggestion;

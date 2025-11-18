/**
 * External dependencies
 */
import React, { forwardRef } from 'react';
import classNames from 'classnames';

const FeatureGroupInfo = forwardRef(
    ({ isVisible, setIsVisible, featureTypes }, ref) => (
        <div
            ref={ref}
            className={classNames('feature-group-info', {
                'is-visible': isVisible,
            })}
        >
            <div className="feature-group-info__inner">
                <button onClick={() => setIsVisible(false)}>
                    <span></span>
                </button>
                <div className="feature-group-info__row">
                    <h5>What’s this all about?</h5>
                </div>
                <div className="feature-group-info__row">
                    <p>
                        Below you will find a series of proposed features, some
                        suggested by community members like you, and others
                        envisioned by our team. By upvoting your most in-demand
                        features, offering suggestions, and adding valuable
                        input to how you’d like a feature to be implemented,
                        you’ll have a huge influence on how our product is
                        developed. Be heard, soar through the ranks, and help us
                        to continue building the best product possible! A few
                        tips to help you out:
                    </p>
                </div>
                <div className="feature-group-info__row">
                    <ul>
                        {featureTypes.map((type) => (
                            <li key={type.id}>
                                <strong
                                    style={{
                                        backgroundColor: type.color,
                                    }}
                                />
                                <span>= {type.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
);

export default FeatureGroupInfo;

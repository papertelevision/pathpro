/**
 * External dependencies
 */
import React from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { debounce } from 'lodash';

/**
 * Internal dependencies
 */
import Box from '@app/components/box/box';
import BoxHeader from '@app/components/box/box-header';
import BoxSubHeader from '@app/components/box/box-subheader';
import BoxContent from '@app/components/box/box-content';
import BoxFooter from '@app/components/box/box-footer';
import BoxButton from '@app/components/box/box-button';
import BoxButtonShare from '@app/components/box/box-button-share';
import BoxButtonUpvote from '@app/components/box/box-button-upvote';
import ButtonIcon from '@app/components/button/button-icon';
import Icon from '@app/components/icon/icon';
import Dots from '@app/components/dots/dots';
import SillyFace from '@/images/icon_community.png';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';
import useSubscriptionStoreMutation from '@app/data/subscription/use-subscription-store-mutation';
import useSubscriptionDestroyMutation from '@app/data/subscription/use-subscription-destroy-mutation';

const Feature = ({
    feature,
    project,
    queryArgs,
    setIsEditFeatureModalOpen,
    setIsConfirmFeatureModalOpen,
    setSelectedFeatureId,
    overallRank,
}) => {
    const { authUser, isUserLoggedIn, canCreateEditTasksFeatures } =
        usePermissionsContextApi();
    const { mutate: mutateSubscriptionStore } = useSubscriptionStoreMutation(
        project.slug,
        queryArgs
    );
    const { mutate: mutateSubscriptionDestroy } =
        useSubscriptionDestroyMutation(project.slug, queryArgs);

    const featurePopularity =
        overallRank < 3 ? new Array(3 - overallRank).fill(0) : [];

    const subscriptionId = feature?.subscribers?.find(
        (item) => item.user_id === authUser?.id
    )?.id;

    const handleNotificationButtonClick = () =>
        subscriptionId
            ? mutateSubscriptionDestroy(subscriptionId)
            : mutateSubscriptionStore({
                  subscribable_id: feature.id,
                  subscribable_type: 'feature',
              });

    return (
        <Box modifier="feature">
            <div className="box__container no-margin">
                <BoxHeader>
                    <BoxHeader.Left>
                        <span
                            className="box__task-status"
                            style={{
                                background: `${feature.feature_type.color}`,
                            }}
                            data-tooltip-id="tooltip"
                            data-tooltip-content={feature.feature_type.title}
                            data-tooltip-float
                            data-tooltip-variant="light"
                            data-tooltip-place="bottom"
                        />
                        <span className="is-display-block">
                            {feature.title}
                        </span>
                    </BoxHeader.Left>

                    <BoxHeader.Right>
                        {feature.upvotes_count > 0 && (
                            <div
                                className="box__header-right-icons"
                                data-tooltip-id="tooltip"
                                data-tooltip-float
                                data-tooltip-variant="light"
                                data-tooltip-attr="popularity"
                            >
                                {featurePopularity.map((_, idx) => (
                                    <Icon key={idx} type="popularity" />
                                ))}
                            </div>
                        )}
                        {canCreateEditTasksFeatures(project.id) && (
                            <ButtonIcon
                                iconType="simple_pencil"
                                color="lighter-gray"
                                onClick={() => {
                                    setSelectedFeatureId(feature.id);
                                    setIsEditFeatureModalOpen(true);
                                }}
                            />
                        )}
                    </BoxHeader.Right>
                </BoxHeader>
                <BoxSubHeader>
                    <ul>
                        <li>
                            Upvotes: <strong>{feature.upvotes_count}</strong>
                        </li>
                        <li>
                            Highlighted Suggestions:{' '}
                            <strong>
                                {feature.highlighted_comments_count}/
                                {feature.comments_count}
                            </strong>
                        </li>
                        {feature.is_task_confirmed && (
                            <li>
                                <span className="box__task-confirmed">
                                    Confirmed!
                                </span>
                            </li>
                        )}
                    </ul>
                </BoxSubHeader>
                <BoxContent>
                    <div className="box__content-text">
                        {parse(
                            DOMPurify.sanitize(feature.description, {
                                ADD_ATTR: ['target'],
                            })
                        )}
                    </div>
                </BoxContent>
                <BoxFooter>
                    <BoxFooter.Left>
                        {feature.comments_count > 0 && (
                            <div
                                className="box__footer-comments-wrapper"
                                data-tooltip-id="tooltip"
                                data-tooltip-float
                                data-tooltip-variant="light"
                                data-tooltip-content={`${feature.comments_count} suggestions have been made by community members for this feature/idea.`}
                                onClick={() => {
                                    setSelectedFeatureId(feature.id);
                                    setIsEditFeatureModalOpen(true);
                                }}
                            >
                                <Icon type="comments" />
                                <span className="box__footer-comments-count">
                                    {feature.comments_count}
                                </span>
                            </div>
                        )}

                        {feature.community_members && feature.community_members.length > 0 && (
                            <img
                                src={SillyFace}
                                alt="Silly Face"
                                width="23px"
                                height="23px"
                                data-tooltip-id="tooltip"
                                data-tooltip-float
                                data-tooltip-variant="light"
                                data-tooltip-html={`Suggested by: ${feature.community_members.map(m => `<span style="color: #24bffa">@${m.username}</span>`).join(', ')}`}
                            />
                        )}
                    </BoxFooter.Left>

                    <BoxFooter.Right>
                        {isUserLoggedIn && (
                            <BoxButton
                                checked={subscriptionId}
                                onClick={debounce(
                                    () => handleNotificationButtonClick(),
                                    500
                                )}
                            >
                                <Icon type="notification" />
                            </BoxButton>
                        )}

                        <BoxButtonShare
                            shareUrl={`/feature/${feature.id}`}
                            shareObject="feature"
                        />

                        <BoxButtonUpvote
                            project={project}
                            upvotable={feature}
                            upvotableType="feature"
                            invalidateQueries={[
                                'project/features/index',
                                project.slug,
                                queryArgs,
                            ]}
                        />

                        <BoxButton
                            onClick={() => {
                                setSelectedFeatureId(feature.id);
                                setIsEditFeatureModalOpen(true);
                            }}
                            data-tooltip-float
                            data-tooltip-id="tooltip"
                            data-tooltip-variant="light"
                            data-tooltip-place="bottom"
                            data-tooltip-attr="dotButton"
                        >
                            <Dots />
                        </BoxButton>
                    </BoxFooter.Right>
                </BoxFooter>
                <div className="box__actions">
                    {!feature.is_task_confirmed &&
                        canCreateEditTasksFeatures(project.id) && (
                            <BoxButton
                                rounded
                                onClick={() => {
                                    setSelectedFeatureId(feature.id);
                                    setIsConfirmFeatureModalOpen(true);
                                }}
                            >
                                Confirm Item
                            </BoxButton>
                        )}
                </div>
            </div>
        </Box>
    );
};

export default Feature;

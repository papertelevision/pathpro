/**
 * External dependencies
 */
import { Tooltip as ReactTooltip } from 'react-tooltip';

const Tooltip = () => {
    const handleRendering = (content, activeAnchor) => {
        if (activeAnchor?.getAttribute('data-tooltip-attr') === 'sillyFace') {
            return (
                <center>
                    Feature originally <br />
                    suggested by community
                </center>
            );
        }
        if (activeAnchor?.getAttribute('data-tooltip-attr') === 'popularity') {
            return (
                <center>
                    Highly <br />
                    Upvoted Feature
                </center>
            );
        }

        if (activeAnchor?.getAttribute('data-tooltip-attr') === 'signUp') {
            return (
                <p className="react-tooltip--text">
                    Sign up to join this product's community! Submit <br />
                    feature requests, vote on new features, and interact
                    <br />
                    with our team as our product evolves! Joining is 100%
                    <br /> free, and unlocks a ton of fun community features!
                </p>
            );
        }

        if (activeAnchor?.getAttribute('data-tooltip-attr') === 'join') {
            return (
                <p className="react-tooltip--text">
                    Join this product's community to submit feature <br />
                    requests, vote on new features, and interact with our
                    <br />
                    team as our product evolves!
                </p>
            );
        }

        if (activeAnchor?.getAttribute('data-tooltip-attr') === 'joined') {
            return (
                <p className="react-tooltip--text">
                    You're a member of this product's community! To
                    <br />
                    change any settings or to leave this product, please
                    <br />
                    visit your profile.
                </p>
            );
        }

        if (activeAnchor?.getAttribute('data-tooltip-attr') === 'rank') {
            return (
                <p className="react-tooltip--text">
                    Your rank is determined by overall interaction with our
                    <br />
                    product. This includes how many feature ideas you’ve
                    <br />
                    submitted, upvotes made on features/ideas, and
                    <br />
                    overall community interaction.
                </p>
            );
        }

        if (activeAnchor?.getAttribute('data-tooltip-attr') === 'dotButton') {
            return <p>Click to view details, offer suggestions, and more.</p>;
        }

        if (activeAnchor?.getAttribute('data-tooltip-attr') === 'share') {
            return 'Copy link for sharing.';
        }

        if (
            activeAnchor?.getAttribute('data-tooltip-attr') ===
            'question-community'
        ) {
            return (
                <p className="react-tooltip--text">
                    This number represents the Community Members that have
                    <br />
                    joined your projects. Community Members are typically <br />
                    customers who have purchased and actively use your <br />
                    product(s), but they can also be clients, followers, or
                    <br />
                    people who simply want to provide feedback on your products,
                    <br />
                    ideas, and services.
                </p>
            );
        }

        if (
            activeAnchor?.getAttribute('data-tooltip-attr') === 'question-team'
        ) {
            return (
                <p className="react-tooltip--text">
                    This number collects Team Members invited and assigned to
                    <br />
                    projects. Team Members are typically internal team members
                    <br />
                    or trusted product partners who have been assigned to <br />
                    projects/products in order to manage and engage with your
                    <br />
                    product's Community Members. Team Members can also manage
                    <br />
                    every aspect of any project they've been assigned/invited
                    to.
                </p>
            );
        }

        if (
            activeAnchor?.getAttribute('data-tooltip-attr') ===
            'question-feature-requests'
        ) {
            return (
                <p className="react-tooltip--text">
                    Feature Requests collect submissions from your community.
                    <br />
                    These may include general feedback on your product, or
                    <br />
                    completely new feature ideas to help inform your product's
                    <br />
                    path, all from actual users. Seeing a submission that will
                    <br />
                    benefit your product? Adopt it to Feature Voting to get
                    <br />
                    feedback from other Community Members, or add it directly
                    <br />
                    into your development pipeline via the Roadmap. <br />
                </p>
            );
        }

        if (
            activeAnchor?.getAttribute('data-tooltip-attr') ===
            'adopt-submission'
        ) {
            return (
                <div>
                    <p>
                        <b>LIKE THIS FEATURE/SUGGESTION?</b>
                        <br />
                        Use the options below to move it into your Path:
                    </p>
                    <p>
                        <b>Highlight For Later Reference: </b>Click this button
                        to draw attention to this submission, and to easily find
                        it later.
                    </p>
                    <p>
                        <b>Adopt to Feature Voting: </b>Add this submission
                        directly to Feature Voting to determine its demand from
                        other Community Members.
                    </p>
                    <p>
                        <b>Adopt to Roadmap: </b>Add this suggestion to your
                        Roadmap and put it directly into production!
                    </p>
                </div>
            );
        }

        if (
            activeAnchor?.getAttribute('data-tooltip-attr') ===
            'free-plan-team-members'
        ) {
            return (
                <p className="react-tooltip--text">
                    <b>Team Members:</b>
                    PathPro’s free plan does not include this feature. To invite
                    Team Members / Collaborators to your project(s), you’ll need
                    to upgrade your plan.
                </p>
            );
        }

        return content;
    };

    return (
        <ReactTooltip
            id="tooltip"
            place="top"
            opacity={1}
            render={({ content, activeAnchor }) =>
                handleRendering(content, activeAnchor)
            }
        />
    );
};

export default Tooltip;

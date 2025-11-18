import classNames from 'classnames';

const Loader = ({ white, gray, fixed, smaller }) => (
    <div
        className={classNames('loader', {
            'is-white': white,
            'is-gray': gray,
            'is-fixed': fixed,
            'is-smaller': smaller,
        })}
    ></div>
);

export default Loader;

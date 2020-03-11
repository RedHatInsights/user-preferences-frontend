import React from 'react';
import { Skeleton } from '@redhat-cloud-services/frontend-components';
import PropTypes from 'prop-types';

const Loader = ({ size }) => (
    <div>
        <Skeleton size={ size }></Skeleton>
    </div>
);

Loader.propTypes = {
    size: PropTypes.string
};

Loader.defaultProps = {
    size: 'md'
};

export default Loader;

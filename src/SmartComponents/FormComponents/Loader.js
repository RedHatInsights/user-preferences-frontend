import React from 'react';
import { Skeleton } from '@redhat-cloud-services/frontend-components/Skeleton';
import PropTypes from 'prop-types';

const Loader = ({
  name = '', // eslint-disable-line no-unused-vars
  size = 'md',
  FieldProvider,
  validate,
  FormSpyProvider,
  formOptions,
  ...rest
}) => (
  <div {...rest}>
    <Skeleton size={size}></Skeleton>
  </div>
);

Loader.propTypes = {
  FieldProvider: PropTypes.any,
  formOptions: PropTypes.any,
  FormSpyProvider: PropTypes.any,
  validate: PropTypes.any,
  name: PropTypes.string,
  size: PropTypes.string,
};

export default Loader;

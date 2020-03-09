import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './descriptiveCheckbox.scss';

// eslint-disable-next-line no-unused-vars
const DescriptiveCheckbox = ({ name, label, description, isDanger, FieldProvider, formOptions, ...rest }) => (
    <Checkbox
        { ...rest }
        id={ `descriptive-checkbox-${name}` }
        className="pref-c__descriptive-checkbox"
        label={ <span className={ classNames('pref-c__checkbox-label', { 'pref-c__checkbox-label-error': isDanger }) }>{label}</span> }
        description={ <span className="pref-c__checkbox-description">{description}</span> }
    />
);

DescriptiveCheckbox.propTypes = {
    FieldProvider: PropTypes.any.apply,
    formOptions: PropTypes.any,
    name: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    isDanger: PropTypes.bool
};

DescriptiveCheckbox.defaultProps = {
    name: '',
    label: '',
    isDanger: false
};

export default DescriptiveCheckbox;

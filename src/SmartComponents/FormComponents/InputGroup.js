import React from 'react';
import PropTypes from 'prop-types';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import { Content, FormGroup } from '@patternfly/react-core';
import './inputGroup.scss';

const InputGroup = ({ fields, label, level, description }) => {
  const formOptions = useFormApi();

  return (
    <FormGroup
      className={`pref-c-input-${level === 1 ? 'category' : 'group'}`}
      label={label}
    >
      {description ? (
        <Content component="p" className="pf-v6-u-pb-md">
          {description}
        </Content>
      ) : null}
      {formOptions.renderForm(fields, formOptions)}
    </FormGroup>
  );
};

InputGroup.propTypes = {
  fields: PropTypes.array.isRequired,
  label: PropTypes.string,
  level: PropTypes.number,
  description: PropTypes.string,
};

export default InputGroup;

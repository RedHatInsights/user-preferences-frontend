import React from 'react';
import PropTypes from 'prop-types';
import { useFormApi } from '@data-driven-forms/react-form-renderer';

const FormTabGroup = ({ fields }) => {
  const formOptions = useFormApi();

  return (
    <div className="pf-v5-c-form">
      {formOptions.renderForm(fields, formOptions)}
    </div>
  );
};

FormTabGroup.propTypes = {
  fields: PropTypes.array.isRequired,
};

export default FormTabGroup;

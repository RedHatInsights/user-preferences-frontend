import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import './descriptiveCheckbox.scss';
import {
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';

const DescriptiveCheckbox = (props) => {
  const {
    label,
    title,
    description,
    checkedWarning,
    infoMessage,
    afterChange,
    disabled,
    input: { onChange, checked, ...input },
  } = useFieldApi({
    ...props,
    type: 'checkbox',
  });
  const formOptions = useFormApi();

  return (
    <Checkbox
      {...input}
      isChecked={checked}
      isDisabled={disabled}
      id={`descriptive-checkbox-${input.name}`}
      onChange={(checked, event, ...rest) => {
        onChange(checked, event, ...rest);
        afterChange?.(formOptions, checked);
      }}
      data-type="descriptive-checkbox"
      className="pref-c-descriptive-checkbox"
      label={label || title}
      description={
        <div>
          {description && (
            <>
              <span className="pref-c-checkbox-description">{description}</span>
            </>
          )}
          {!checked && infoMessage && (
            <span className="pref-c-checkbox-info">
              <InfoCircleIcon /> {infoMessage}
            </span>
          )}
          {checked && checkedWarning && (
            <span className="pref-c-checkbox-warning">
              <ExclamationTriangleIcon /> {checkedWarning}
            </span>
          )}
        </div>
      }
    />
  );
};

DescriptiveCheckbox.propTypes = {
  FieldProvider: PropTypes.any,
  formOptions: PropTypes.any,
  group: PropTypes.string,
  section: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  afterChange: PropTypes.func,
};

DescriptiveCheckbox.defaultProps = {
  name: '',
  label: '',
};

export default DescriptiveCheckbox;

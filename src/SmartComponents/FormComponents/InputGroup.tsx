import React from 'react';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import './inputGroup.scss';

export type InputGroupProps = {
  fields: [];
  label: string;
  level: number;
  description: string;
}

const InputGroup = ({ fields, label, level, description }: InputGroupProps) => {
  const { renderForm } = useFormApi();

  return (
    <FormGroup
      className={`pref-c-input-${level === 1 ? 'category' : 'group'}`}
      label={label}
    >
      {description ? <Text className="pf-u-pb-md">{description}</Text> : null}
      {renderForm(fields)}
    </FormGroup>
  );
};

export default InputGroup;

import React from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import './BulkSelectButton.scss';
import { useSearchParams } from 'react-router-dom';

const BulkSelectButton = (props) => {
  const formOptions = useFormApi();
  const { input, section, onClick } = useFieldApi({
    ...props,
    type: 'button',
  });

  const [searchParams] = useSearchParams();

  return (
    <Button
      className="pref-c-bulk-select-button"
      variant="secondary"
      isDisabled={
        searchParams.get('bundle') === 'openshift' &&
        searchParams.get('app') === 'cluster-manager'
      }
      {...input}
      id={`bulk-select-${section}`}
      onClick={() => onClick?.(formOptions, input)}
    >
      {input.value ? 'Select' : 'Deselect'} all
    </Button>
  );
};

BulkSelectButton.propTypes = {
  section: PropTypes.string,
  onClick: PropTypes.func,
};

export default BulkSelectButton;

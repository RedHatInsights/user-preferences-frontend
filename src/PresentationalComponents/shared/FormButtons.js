import { defineMessages, useIntl } from 'react-intl';
import React from 'react';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { isEmpty } from 'lodash';
import { ActionGroup } from '@patternfly/react-core';
import { FormSpy } from '@data-driven-forms/react-form-renderer';
import './form-buttons.scss';

const messages = defineMessages({
  save: {
    id: 'userPrefs.formButtons.save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'userPrefs.formButtons.cancel',
    defaultMessage: 'Cancel',
  },
});

const FormButtons = ({
  dirtyFieldsSinceLastSubmit,
  submitSucceeded,
  pristine,
}) => {
  const intl = useIntl();
  const { reset } = useFormApi();
  const noChanges =
    isEmpty(dirtyFieldsSinceLastSubmit) || (!submitSucceeded && pristine);
  return noChanges ? null : (
    <div
      id="user-pref__form-buttons"
      className="pref-shared--buttons pf-m-9-col-on-md"
    >
      <ActionGroup className="pref-shared--actions pf-v6-u-px-lg pf-v6-u-py-md">
        <Button
          type="submit"
          ouiaId="user-pref__submit-button"
          isDisabled={noChanges}
          variant="primary"
        >
          {intl.formatMessage(messages.save)}
        </Button>
        <Button
          variant="link"
          ouiaId="user-pref__reset-button"
          isDisabled={noChanges}
          onClick={() => reset()}
        >
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ActionGroup>
    </div>
  );
};

FormButtons.propTypes = {
  dirtyFieldsSinceLastSubmit: PropTypes.shape({
    [PropTypes.string]: PropTypes.oneOfType([PropTypes.bool]),
  }),
  submitSucceeded: PropTypes.bool,
  pristine: PropTypes.bool,
};

const FormButtonWithSpies = (formProps) => (
  <FormSpy
    subscription={{
      pristine: true,
      submitSucceeded: true,
      dirtyFieldsSinceLastSubmit: true,
    }}
  >
    {(props) => <FormButtons {...props} {...formProps} />}
  </FormSpy>
);

export default FormButtonWithSpies;

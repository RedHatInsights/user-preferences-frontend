import { defineMessages, useIntl } from 'react-intl';
import React from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import './BulkSelectButton.scss';
import { useSearchParams } from 'react-router-dom';
import {
  CLUSTER_MANAGER_MESSAGE,
  isClusterManager,
} from '../../Utilities/clusterManagerConstants';

const messages = defineMessages({
  selectAll: {
    id: 'userPrefs.bulkSelect.selectAll',
    defaultMessage: '{action} all',
  },
  select: {
    id: 'userPrefs.bulkSelect.select',
    defaultMessage: 'Select',
  },
  deselect: {
    id: 'userPrefs.bulkSelect.deselect',
    defaultMessage: 'Deselect',
  },
});

const BulkSelectButton = (props) => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const { input, section, onClick } = useFieldApi({
    ...props,
    type: 'button',
  });

  const [searchParams] = useSearchParams();

  const showTooltipAndDisableButton = isClusterManager(
    searchParams.get('bundle'),
    searchParams.get('app')
  );

  return showTooltipAndDisableButton ? (
    <Tooltip content={CLUSTER_MANAGER_MESSAGE}>
      <Button
        className="pref-c-bulk-select-button pf-v6-u-mb-md"
        variant="secondary"
        isDisabled={showTooltipAndDisableButton}
        {...input}
        id={`bulk-select-${section}`}
        onClick={() => onClick?.(formOptions, input)}
      >
        {intl.formatMessage(messages.selectAll, {
          action: input.value
            ? intl.formatMessage(messages.select)
            : intl.formatMessage(messages.deselect),
        })}
      </Button>
    </Tooltip>
  ) : (
    <Button
      className="pref-c-bulk-select-button pf-v6-u-mb-md"
      variant="secondary"
      isDisabled={showTooltipAndDisableButton}
      {...input}
      id={`bulk-select-${section}`}
      onClick={() => onClick?.(formOptions, input)}
    >
      {intl.formatMessage(messages.selectAll, {
        action: input.value
          ? intl.formatMessage(messages.select)
          : intl.formatMessage(messages.deselect),
      })}
    </Button>
  );
};

BulkSelectButton.propTypes = {
  section: PropTypes.string,
  onClick: PropTypes.func,
};

export default BulkSelectButton;

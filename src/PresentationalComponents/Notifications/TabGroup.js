import React from 'react';
import PropTypes from 'prop-types';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import { Alert } from '@patternfly/react-core';
import {
  CLUSTER_MANAGER_URL,
  isClusterManager,
} from '../../Utilities/clusterManagerConstants';

const FormTabGroup = ({ fields, bundle, app }) => {
  const formOptions = useFormApi();
  const isClusterManagerContext = isClusterManager(bundle, app);

  return (
    <div className="pf-c-form">
      {isClusterManagerContext && (
        <Alert
          variant="info"
          isInline
          className="pf-v6-u-mb-md"
          title={
            <>
              Preferences for OpenShift notifications are currently being
              managed for individual clusters in the{' '}
              <a href={CLUSTER_MANAGER_URL}>Cluster Manager</a> service.
            </>
          }
        />
      )}
      {formOptions.renderForm(fields, formOptions)}
    </div>
  );
};

FormTabGroup.propTypes = {
  fields: PropTypes.array.isRequired,
  bundle: PropTypes.string,
  app: PropTypes.string,
};

export default FormTabGroup;

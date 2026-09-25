import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import WarningModal from '@patternfly/react-component-groups/dist/dynamic/WarningModal';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import FormButtons from '../shared/FormButtons';
import pathnames from '../../Utilities/pathnames';

const NotificationsTemplate = ({ schema, formFields }) => {
  const formApi = useFormApi();
  const [isVisibleDialog, setVisibleDialog] = useState(false);

  const { chromeHistory } = useChrome();
  const [triggerExit, setTriggerExit] = useState({
    confirmed: false,
    pathname: '',
    search: '',
  });

  const handleGoToIntendedPage = useCallback(
    (pathname, search) =>
      search.length > 0
        ? chromeHistory.push({ pathname, search })
        : chromeHistory.push(pathname),
    [chromeHistory]
  );

  useEffect(() => {
    const navigationAllowed =
      !formApi.getState().dirty ||
      triggerExit.confirmed ||
      triggerExit.search.length > 0;
    // Only navigate once `block` has told us where the user actually wanted to go.
    // On mount `triggerExit.pathname` is still empty, and `chromeHistory.push('')`
    // resolves to the current pathname with the query string dropped -- which would
    // discard deep-link params such as `?bundle=console&app=rbac`.
    navigationAllowed &&
      triggerExit.pathname.length > 0 &&
      handleGoToIntendedPage(triggerExit.pathname, triggerExit.search);

    const unblock = chromeHistory.block(({ location }) => {
      if (
        formApi.getState().dirty &&
        location.search?.length === 0 &&
        !(
          location.pathname?.includes(pathnames.notifications.link) &&
          location.pathname?.includes('user-preferences')
        )
      ) {
        setVisibleDialog(true);
      }
      setTriggerExit((obj) => ({
        ...obj,
        pathname: location.pathname,
        search: location.search,
      }));
      return navigationAllowed;
    });

    return () => {
      unblock();
    };
  }, [triggerExit.confirmed, triggerExit.pathname, triggerExit.search]);

  return (
    <>
      <WarningModal
        isOpen={isVisibleDialog}
        title="Unsaved changes"
        onConfirm={() => {
          setTriggerExit((obj) => ({
            ...obj,
            confirmed: true,
          }));
          setVisibleDialog(false);
        }}
        onClose={() => setVisibleDialog(false)}
      >
        Your page contains unsaved changes. Do you want to leave?
      </WarningModal>

      <form onSubmit={formApi.handleSubmit} style={{ display: 'contents' }}>
        {schema.title}
        {formFields}
        <FormButtons />
      </form>
    </>
  );
};

NotificationsTemplate.propTypes = {
  schema: PropTypes.shape({
    title: PropTypes.node,
  }),
  formFields: PropTypes.array,
};

export default NotificationsTemplate;

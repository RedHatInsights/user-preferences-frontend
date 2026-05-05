import React, { Fragment, useEffect } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationsPortal';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import { Bullseye, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import './App.scss';
import Routing from './Routing';

const App = () => {
  const { auth, updateDocumentTitle } = useChrome();
  const isEnvironmentEnabled = useFlag(
    'platform.user-preferences.environment.enabled'
  );

  updateDocumentTitle?.(
    'Notification Preferences | Hybrid Cloud Console',
    true
  );

  useEffect(() => {
    (async () => {
      const user = await auth.getUser();
      if (!user) {
        location.href = './';
      }
    })();
  }, []);

  if (!isEnvironmentEnabled) {
    return (
      <Bullseye>
        <EmptyState
          titleText="Notification preferences are not available in this environment"
          headingLevel="h2"
          icon={LockIcon}
        >
          <EmptyStateBody>
            This feature is not enabled for your current environment.
          </EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }

  return (
    <NotificationsProvider>
      <Fragment>
        <NotificationsPortal />
        <Routing />
      </Fragment>
    </NotificationsProvider>
  );
};

export default App;

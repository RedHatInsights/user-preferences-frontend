import React, { Fragment, useEffect } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import './App.scss';
import Routing from './Routing';
import { KesselRbacAccessProvider } from './Utilities/kesselRbac';

const AppInner: React.FC = () => {
  const { auth, updateDocumentTitle } = useChrome();

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

  return (
    <NotificationsProvider>
      <Fragment>
        <NotificationsPortal />
        <Routing />
      </Fragment>
    </NotificationsProvider>
  );
};

const App: React.FC = () => {
  return (
    <AccessCheck.Provider
      baseUrl={window.location.origin}
      apiPath="/api/kessel/v1beta2"
    >
      <KesselRbacAccessProvider>
        <AppInner />
      </KesselRbacAccessProvider>
    </AccessCheck.Provider>
  );
};

export default App;

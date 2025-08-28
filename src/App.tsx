import React, { Fragment, useEffect } from 'react';
import { NotificationsPortal, NotificationsProvider } from '@redhat-cloud-services/frontend-components-notifications';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import './App.scss';
import Routing from './Routing';

const App = () => {
  const { auth, updateDocumentTitle } = useChrome();

  updateDocumentTitle?.('Notification Preferences | Hybrid Cloud Console', true);

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

export default App;

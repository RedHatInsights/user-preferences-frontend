import React, { Fragment, useEffect } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import './App.scss';
import Routing from './Routing';

const App = () => {
  const { auth, updateDocumentTitle } = useChrome();

  updateDocumentTitle?.('User Preferences');

  useEffect(() => {
    (async () => {
      const user = await auth.getUser();
      if (!user) {
        location.href = './';
      }
    })();
  }, []);

  return (
    <Fragment>
      <NotificationsPortal />
      <Routing />
    </Fragment>
  );
};

export default App;

import React, { Fragment, useEffect } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import './App.scss';
import Routing from './Routing';
import { KesselRbacAccessProvider } from './Utilities/kesselRbac';

/**
 * Inner app component - handles auth and routing
 * Separated to allow Kessel provider to wrap it
 */
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

/**
 * Version router: reads the platform.rbac.workspaces flag and renders with or without Kessel providers.
 * This matches the pattern from insights-rbac-ui/src/Iam.tsx
 */
const VersionRouter: React.FC = () => {
  const hasRbacV2 = useFlag('platform.rbac.workspaces');

  // Make v2 flag available to functions.js
  useEffect(() => {
    // eslint-disable-next-line rulesdir/no-chrome-api-call-from-window
    if (window.insights?.chrome) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, rulesdir/no-chrome-api-call-from-window
      (window.insights.chrome as any)._isRbacV2Org = hasRbacV2;
    }
  }, [hasRbacV2]);

  return hasRbacV2 ? (
    // RBAC v2: Wrap with Kessel providers
    <AccessCheck.Provider
      baseUrl={window.location.origin}
      apiPath="/api/kessel/v1beta2"
    >
      <KesselRbacAccessProvider>
        <AppInner />
      </KesselRbacAccessProvider>
    </AccessCheck.Provider>
  ) : (
    // RBAC v1: No Kessel providers needed
    <AppInner />
  );
};

/**
 * Main application entry point.
 */
const App: React.FC = () => {
  return <VersionRouter />;
};

export default App;

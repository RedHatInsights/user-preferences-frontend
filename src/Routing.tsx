import React, { Suspense, lazy, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import pathnames from './Utilities/pathnames';
import { InvalidObject } from '@redhat-cloud-services/frontend-components';

const Notifications = lazy(() => import('./PresentationalComponents/Notifications/Notifications'));

const routes = [
  {
    path: pathnames.notifications.route,
    element: Notifications,
  },
];

interface RouteType {
  path?: string;
  element: React.ComponentType;
  childRoutes?: RouteType[];
  elementProps?: Record<string, unknown>;
}

const renderRoutes = (routes: RouteType[] = []) =>
  routes.map(({ path, element: Element, childRoutes, elementProps }) => (
    <Route key={path} path={path} element={<Element {...elementProps} />}>
      {renderRoutes(childRoutes)}
    </Route>
  ));

export const Routing = () => {
  const renderedRoutes = useMemo(() => renderRoutes(routes), [routes]);
  return (<Suspense fallback={<InvalidObject/>}>
    <Routes>
      {renderedRoutes}
      {/* Catch all unmatched routes */}
      <Route path="*" element={<Notifications />} />
    </Routes>
  </Suspense>
)}

export default Routing;

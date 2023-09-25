import React, { Fragment, Suspense, lazy, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import pckg from '../package.json';

const Notifications = lazy(() => import('./PresentationalComponents/Notifications/Notifications'));

const routes = [
  {
    path: pckg.routes.notifications,
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
  return (<Suspense fallback={Fragment}>
    <Routes>
      {renderedRoutes}
      {/* Catch all unmatched routes */}
      <Route path="*" element={<Navigate to={pckg.routes.notifications} />} />
    </Routes>
  </Suspense>
)}

export default Routing;

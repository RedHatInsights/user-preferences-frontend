import React, { Fragment, lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import pckg from '../package.json';

const Email = lazy(() =>
  import(
    /* webpackChunkName: "Email" */ './PresentationalComponents/Email/Email'
  )
);

export const Routes = () => (
  <Suspense fallback={Fragment}>
    <Switch>
      <Route path={pckg.routes.email} component={Email} rootClass="email" />
      <Redirect path="*" to={pckg.routes.email} push />
    </Switch>
  </Suspense>
);

import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
export { default as emailPreferences } from './email-preferences';
export { default as notificationPreferences } from './notification-preferences';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

let registry;

export function init(...middleware) {
  if (registry) {
    throw new Error('store already initialized');
  }

  registry = new ReducerRegistry({}, [
    promiseMiddleware,
    notificationsMiddleware({ autoDismiss: true }),
    ...middleware.filter((item) => typeof item !== 'undefined'),
  ]);

  //If you want to register all of your reducers, this is good place.
  /*
   *  registry.register({
   *    someName: (state, action) => ({...state})
   *  });
   */
  return registry;
}

export function getStore() {
  return registry.getStore();
}

export function register(...args) {
  return registry.register(...args);
}

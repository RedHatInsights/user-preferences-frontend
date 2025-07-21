import { createContext } from 'react';
import ReducerRegistry, {
  applyReducerHash,
} from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications';
import { notificationsReducer as notifications } from '@redhat-cloud-services/frontend-components-notifications';
import reduxLogger from 'redux-logger';
import emailReducer, {
  emailInitialState,
} from '../redux/reducers/email-reducer';
import notificationsReducer, {
  notificationsInitialState,
} from '../redux/reducers/notifications-reducer';

export const RegistryContext = createContext({
  getRegistry: () => {},
});

const middlewares = [
  promiseMiddleware,
  notificationsMiddleware({
    errorTitleKey: ['statusText', 'message', 'errors[0].status'],
    errorDescriptionKey: ['errors[0].detail', 'errors', 'stack'],
  }),
  reduxLogger,
].filter((middleware) => typeof middleware === 'function');

export const registry = new ReducerRegistry({}, middlewares);

registry.register({
  emailReducer: applyReducerHash(emailReducer, emailInitialState),
  notificationsReducer: applyReducerHash(
    notificationsReducer,
    notificationsInitialState
  ),
  notifications,
});

export default registry;

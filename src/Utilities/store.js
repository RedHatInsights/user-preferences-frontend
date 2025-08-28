import { createContext } from 'react';
import ReducerRegistry, {
  applyReducerHash,
} from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
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

const middlewares = [promiseMiddleware, reduxLogger].filter(
  (middleware) => typeof middleware === 'function'
);

export const registry = new ReducerRegistry({}, middlewares);

registry.register({
  emailReducer: applyReducerHash(emailReducer, emailInitialState),
  notificationsReducer: applyReducerHash(
    notificationsReducer,
    notificationsInitialState
  ),
});

export default registry;

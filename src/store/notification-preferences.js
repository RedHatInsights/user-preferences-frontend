import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { ACTION_TYPES } from '../constants';

const defaultState = {};

export const loading = (store, { meta }) => {
  return {
    ...store,
    bundleName: meta.bundleName,
    schema: [],
    loaded: false,
  };
};

export const getSchema = (store, { payload, meta }) => {
  return {
    ...store,
    bundleName: meta.bundleName,
    schema: payload || [],
    loaded: true,
  };
};

export default {
  notificationPreferences: applyReducerHash(
    {
      [ACTION_TYPES.GET_NOTIFICATION_SCHEMA]: getSchema,
      [`${ACTION_TYPES.GET_NOTIFICATION_SCHEMA}_FULFILLED`]: getSchema,
      [`${ACTION_TYPES.GET_NOTIFICATION_SCHEMA}_PENDING`]: loading,
      // eslint-disable-next-line no-unused-vars
      [`${ACTION_TYPES.GET_NOTIFICATION_SCHEMA}_REJECTED`]: (
        state,
        { payload, ...action }
      ) => getSchema(state, action),
    },
    defaultState
  ),
};

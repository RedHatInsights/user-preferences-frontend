import { getApplicationSchema, saveValues as save } from './api';
import { ACTION_TYPES } from './constants';
import config from './config/config.json';
import { notificationConfigForBundle } from './Utilities/functions';

export const getNotificationSchema = ({ bundleName, apiVersion }) => ({
  type: ACTION_TYPES.GET_NOTIFICATION_SCHEMA,
  payload: getApplicationSchema(
    notificationConfigForBundle(bundleName)?.application,
    apiVersion,
    notificationConfigForBundle(bundleName)?.resourceType
  ),
  meta: {
    bundleName,
    notifications: {
      rejected: {
        variant: 'danger',
        title: "Request for user's configuration failed",
        description: `User's configuration notification for this bundle does not exist.`,
      },
    },
  },
});

export const saveNotificationValues = ({ bundleName, values, apiVersion }) => ({
  type: ACTION_TYPES.SAVE_NOTIFICATION_SCHEMA,
  payload: save(
    notificationConfigForBundle(bundleName)?.application,
    values,
    apiVersion,
    notificationConfigForBundle(bundleName)?.resourceType
  ),
  meta: {
    bundleName: bundleName,
    noError: true,
  },
});

export const getEmailSchema = ({
  application,
  apiVersion,
  resourceType = 'email-preference',
  schema,
  url,
  apiName,
}) => ({
  type: ACTION_TYPES.GET_EMAIL_SCHEMA,
  payload:
    schema ||
    getApplicationSchema(apiName || application, apiVersion, resourceType, url),
  meta: {
    appName: application,
    notifications: {
      rejected: {
        variant: 'danger',
        title: "Request for user's configuration failed",
        description: `User's configuration email for ${config['email-preference']?.[application]?.title} application does not exist.`,
      },
    },
  },
});

export const saveEmailValues = ({
  application,
  values,
  apiVersion,
  resourceType = 'email-preference',
  url,
  apiName,
}) => ({
  type: ACTION_TYPES.SAVE_EMAIL_SCHEMA,
  payload: save(apiName || application, values, apiVersion, resourceType, url),
  meta: {
    appName: application,
    title: config['email-preference']?.[application]?.title,
    noError: true,
  },
});

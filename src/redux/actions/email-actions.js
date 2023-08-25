import { getApplicationSchema, saveValues as save } from '../../api';
import { ACTION_TYPES } from '../action-types';

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
        description: `User's configuration email for ${application?.label} application does not exist.`,
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
    title: application?.label,
    noError: true,
  },
});

import { getNotificationsApi } from '../../api';
import { ACTION_TYPES } from '../action-types';

export const getNotificationsSchema = () => ({
  type: ACTION_TYPES.GET_NOTIFICATIONS_SCHEMA,
  payload: getNotificationsApi().getSubscriptions(),
  meta: {
    notifications: {
      rejected: {
        variant: 'danger',
        title: "Request for user's configuration failed",
        description: `User's configuration notification for this bundle does not exist.`,
      },
    },
  },
});

export const saveNotificationValues = (values) => ({
  type: ACTION_TYPES.SAVE_NOTIFICATION_SCHEMA,
  payload: getNotificationsApi().updateSubscriptions({ body: values }),
});

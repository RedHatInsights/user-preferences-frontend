import axios from 'axios';
import {
  errorInterceptor,
  interceptor500,
  responseDataInterceptor,
} from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import instance from '@redhat-cloud-services/frontend-components-utilities/interceptors';
export { instance };

// Notifications v3 endpoints
import getUserConfigSubscriptions from '@redhat-cloud-services/notifications-client/v3/UserConfigResourceV3GetSubscriptions';
import updateUserConfigSubscriptions from '@redhat-cloud-services/notifications-client/v3/UserConfigResourceV3UpdateSubscriptions';

import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared/dist/utils';

const NOTIFICATIONS_V3_API_BASE = '/api/notifications/v3';

const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(responseDataInterceptor);
axiosInstance.interceptors.response.use(null, interceptor500);
axiosInstance.interceptors.response.use(null, errorInterceptor);

const notificationsApi = new APIFactory(
  NOTIFICATIONS_V3_API_BASE,
  {
    getSubscriptions: getUserConfigSubscriptions,
    updateSubscriptions: updateUserConfigSubscriptions,
  },
  { axios: axiosInstance }
);

export function getNotificationsApi() {
  return notificationsApi;
}

// Used for email preferences (non-notifications APIs)
export const getApplicationSchema = (
  application,
  apiVersion = 'v1',
  resourceType = '',
  url
) =>
  instance.get(
    `/api/${application}/${apiVersion}${url || `/user-config/${resourceType}`}`
  );

export const saveValues = async (apiName, values, apiVersion = 'v1', url) =>
  instance.post(
    `/api/${apiName}/${apiVersion}${
      url || '/user-config/notification-event-type-preference'
    }`,
    values
  );

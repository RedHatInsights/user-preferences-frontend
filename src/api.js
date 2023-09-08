import APIFactory from '@redhat-cloud-services/notifications-client';
import instance from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import getPreferences from '@redhat-cloud-services/notifications-client/dist/UserConfigResourceV1GetPreferences';
import getSettingsSchema from '@redhat-cloud-services/notifications-client/dist/UserConfigResourceV1GetSettingsSchema';
import saveSettings from '@redhat-cloud-services/notifications-client/dist/UserConfigResourceV1SaveSettings';
export { instance };

const notificationsApi = APIFactory('/api/notifications/v1', undefined, {
  getPreferences,
  getSettingsSchema,
  saveSettings,
});

instance.interceptors.response.use((response) => {
  if (response?.config?.data) {
    try {
      return JSON.parse(response.config.data);
    } catch (_e) {
      return response.config.data;
    }
  }

  return response;
});

export const getApplicationSchema = (
  application,
  apiVersion = 'v1',
  resourceType = '',
  url
) =>
  instance.get(
    `/api/${application}/${apiVersion}${url || `/user-config/${resourceType}`}`
  );

export const getNotificationsSchema = (apiVersion = 'v1') =>
  notificationsApi.getPreferences();
// instance.get(
//   `/api/notifications/${apiVersion}/user-config/notification-event-type-preference`
// );

export const saveValues = async (apiName, values, apiVersion = 'v1', url) =>
  instance.post(
    `/api/${apiName}/${apiVersion}${
      url || '/user-config/notification-event-type-preference'
    }`,
    values
  );

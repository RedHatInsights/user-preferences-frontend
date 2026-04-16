import { HttpResponse, http } from 'msw';
import Notifications from './Notifications';

const mockNotificationBundles = {
  bundles: {
    rhel: {
      label: 'Red Hat Enterprise Linux',
      applications: {
        advisor: {
          label: 'Advisor',
          eventTypes: {
            'new-recommendation': {
              label: 'New recommendation',
              fields: [
                {
                  name: 'bundles[rhel][applications][advisor][eventTypes][new-recommendation]',
                  label: 'New recommendation',
                  component: 'descriptiveCheckbox',
                  initialValue: false,
                },
              ],
            },
          },
        },
      },
    },
  },
};

const handlers = [
  http.get(
    '/api/notifications/v1/user-config/notification-event-type-preference',
    () => HttpResponse.json(mockNotificationBundles)
  ),
  http.get('/api/insights/v1/user-preferences/', () =>
    HttpResponse.json({ is_subscribed: true })
  ),
];

const meta = {
  title: 'Pages/My Notifications',
  component: Notifications,
  parameters: {
    layout: 'fullscreen',
    msw: { handlers },
  },
};

export default meta;

export const Default = {
  name: 'With severity help',
  parameters: {
    featureFlags: {
      'platform.notifications.severity': true,
    },
  },
};

export const SeverityHelpOff = {
  name: 'Severity help hidden (flag off)',
  parameters: {
    featureFlags: {
      'platform.notifications.severity': false,
    },
  },
};

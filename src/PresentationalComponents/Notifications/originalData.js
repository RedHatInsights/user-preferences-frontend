export const data = {
  fields: [
    {
      name: 'notification-preferences',
      label: null,
      component: 'section',
      sections: [
        {
          name: 'subscriptions',
          label: 'Subscriptions',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[subscriptions].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
              ],
            },
          ],
        },
        {
          name: 'malware-detection',
          label: 'Malware',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[malware-detection].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: false,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
              ],
            },
          ],
        },
        {
          name: 'policies',
          label: 'Policies',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[policies].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
                {
                  name: 'bundles[rhel].applications[policies].notifications[DAILY]',
                  label: 'Daily digest',
                  description:
                    'Daily summary of triggered application events in 24 hours span. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                },
              ],
            },
          ],
        },
        {
          name: 'vulnerability',
          label: 'Vulnerability',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[vulnerability].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
                {
                  name: 'bundles[rhel].applications[vulnerability].notifications[DAILY]',
                  label: 'Daily digest',
                  description:
                    'Daily summary of triggered application events in 24 hours span. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                },
              ],
            },
          ],
        },
        {
          name: 'inventory',
          label: 'Inventory',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[inventory].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: false,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
                {
                  name: 'bundles[rhel].applications[inventory].notifications[DAILY]',
                  label: 'Daily digest',
                  description:
                    'Daily summary of triggered application events in 24 hours span. See notification settings for configuration.',
                  initialValue: false,
                  component: 'descriptiveCheckbox',
                  validate: [],
                },
              ],
            },
          ],
        },
        {
          name: 'patch',
          label: 'Patch',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[patch].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: false,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
                {
                  name: 'bundles[rhel].applications[patch].notifications[DAILY]',
                  label: 'Daily digest',
                  description:
                    'Daily summary of triggered application events in 24 hours span. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                },
              ],
            },
          ],
        },
        {
          name: 'advisor',
          label: 'Advisor',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[advisor].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
              ],
            },
          ],
        },
        {
          name: 'compliance',
          label: 'Compliance',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[compliance].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
                {
                  name: 'bundles[rhel].applications[compliance].notifications[DAILY]',
                  label: 'Daily digest',
                  description:
                    'Daily summary of triggered application events in 24 hours span. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                },
              ],
            },
          ],
        },
        {
          name: 'edge-management',
          label: 'Edge Management',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[edge-management].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
              ],
            },
          ],
        },
        {
          name: 'resource-optimization',
          label: 'Resource Optimization',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[resource-optimization].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: false,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
                {
                  name: 'bundles[rhel].applications[resource-optimization].notifications[DAILY]',
                  label: 'Daily digest',
                  description:
                    'Daily summary of triggered application events in 24 hours span. See notification settings for configuration.',
                  initialValue: false,
                  component: 'descriptiveCheckbox',
                  validate: [],
                },
              ],
            },
          ],
        },
        {
          name: 'test-application',
          label: 'My test application',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[test-application].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: false,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
              ],
            },
          ],
        },
        {
          name: 'tasks',
          label: 'Tasks',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[tasks].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: false,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
              ],
            },
          ],
        },
        {
          name: 'drift',
          label: 'Drift',
          component: null,
          fields: [
            {
              name: null,
              label: null,
              component: null,
              fields: [
                {
                  name: 'bundles[rhel].applications[drift].notifications[INSTANT]',
                  label: 'Instant notification',
                  description:
                    'Immediate email for each triggered application event. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  checkedWarning:
                    'Opting into this notification may result in a large number of emails',
                },
                {
                  name: 'bundles[rhel].applications[drift].notifications[DAILY]',
                  label: 'Daily digest',
                  description:
                    'Daily summary of triggered application events in 24 hours span. See notification settings for configuration.',
                  initialValue: true,
                  component: 'descriptiveCheckbox',
                  validate: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

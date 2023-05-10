export const userPrefInitialState = {
  notificationsReducer: {
    bundles: {
      console: {
        name: 'notification-preferences',
        label: null,
        component: 'section',
        sections: [
          {
            name: 'sources',
            label: 'Sources',
            component: null,
            fields: [
              {
                name: null,
                label: null,
                component: null,
                fields: [
                  {
                    name: 'bundles[console].applications[sources].notifications[INSTANT]',
                    label: 'Instant notification',
                    description: 'Description.',
                    initialValue: true,
                    component: 'descriptiveCheckbox',
                    validate: [],
                    checkedWarning: 'Another warning',
                  },
                  {
                    name: 'is_subscribed',
                    label: 'email test',
                    description: 'Description.',
                    initialValue: true,
                    component: 'descriptiveCheckbox',
                    validate: [],
                    checkedWarning: 'Another warning',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  emailReducer: {
    unsubscribe: {
      schema: [
        {
          fields: [
            {
              name: 'unsubscribe.from-all',
              isGlobal: true,
              label: 'Unsubscribe from all',
              initialValue: false,
              component: 'descriptiveCheckbox',
            },
          ],
        },
      ],
      loaded: true,
    },
    advisor: {
      schema: [
        {
          fields: [
            {
              name: 'is_subscribed',
              label: 'Weekly Report',
              title: 'Weekly report',
              description:
                "Subscribe to this account's Advisor Weekly Report email",
              helperText:
                "User-specific setting to subscribe a user to the account's weekly reports email",
              component: 'descriptiveCheckbox',
              isRequired: true,
              initialValue: false,
              isDisabled: false,
            },
          ],
        },
      ],
      loaded: true,
    },
  },
};

export const userPrefEmptyInitialState = {
  notificationsReducer: {
    bundles: {},
  },
  emailReducer: {},
};

export const calculateEmailConfigResponse = {
  advisor: {
    isVisible: {},
    url: '/user-preferences/',
    apiName: 'insights',
    bundle: 'rhel',
    title: 'Advisor',
  },
  unsubscribe: {
    localFile: 'data/unsubscribe.json',
    isVisible: true,
    title: '',
  },
};

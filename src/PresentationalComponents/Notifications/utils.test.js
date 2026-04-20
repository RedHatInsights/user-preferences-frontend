import { prepareFields } from './utils';
import { SEVERITY_SUBSCRIPTION_GRID } from '../../SmartComponents/FormComponents/componentTypes';

describe('prepareFields', () => {
  it('should emit severity subscription grid when all fields define severities', () => {
    const notifPref = {
      rhel: {
        label: 'RHEL',
        applications: {
          compliance: {
            label: 'Compliance',
            eventTypes: [
              {
                name: 'POLICY_FAILED',
                label: 'Policy failed',
                fields: [
                  {
                    name: 'INSTANT',
                    label: 'Instant email',
                    severities: [
                      {
                        name: 'CRITICAL',
                        initialValue: false,
                        disabled: false,
                      },
                      {
                        name: 'IMPORTANT',
                        initialValue: true,
                        disabled: false,
                      },
                    ],
                  },
                  {
                    name: 'DAILY',
                    label: 'Daily digest email',
                    severities: [
                      {
                        name: 'CRITICAL',
                        initialValue: false,
                        disabled: false,
                      },
                      {
                        name: 'IMPORTANT',
                        initialValue: false,
                        disabled: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    };
    const result = prepareFields(notifPref, {}, {});
    const tab = result[0].fields[0];
    const eventInput = tab.fields.find((f) => f.name === 'event-notifications');
    const eventGroup = eventInput.fields[0];
    const gridField = eventGroup.fields[0];
    expect(gridField.component).toBe(SEVERITY_SUBSCRIPTION_GRID);
    expect(gridField.name).toBe(
      'bundles[rhel].applications[compliance].eventTypes[POLICY_FAILED]'
    );
    expect(gridField.subscriptionColumns).toHaveLength(2);
    expect(gridField.initialValue.subscriptionTypes.INSTANT.IMPORTANT).toBe(
      true
    );
  });

  it('should return correct output', () => {
    const notifPref = {
      rhel: {
        label: 'RHEL',
        applications: {
          advisor: {
            label: 'Test',
            eventTypes: [
              {
                name: 'testName',
                label: 'testLabel',
                fields: [
                  {
                    label: 'Instant notification',
                    description: 'Instant description',
                    component: 'descriptiveCheckbox',
                  },
                  {
                    label: 'Drawer notification',
                    description: 'Drawer description',
                    component: 'descriptiveCheckbox',
                  },
                ],
              },
            ],
          },
        },
      },
    };
    const emailPref = {
      advisor: {
        schema: [
          {
            fields: [
              {
                name: 'is_subscribed',
                label: 'Weekly Report',
                title: 'Weekly report',
                description:
                  "Subscribe to this account's Test Weekly Report email",
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
    };
    const emailConfig = {
      advisor: {
        isVisible: {},
        url: '/test/',
        apiName: 'name',
        bundle: 'rhel',
        title: 'test',
      },
    };
    const expected =
      '[{"title":"RHEL","name":"rhel","fields":[{"name":"advisor","bundle":"rhel","label":"Test","component":"tabGroup","fields":[{"name":"bundles[rhel].applications[advisor].eventTypes[BULK_SELECT_BUTTON]","section":"advisor","initialValue":true,"component":"BULK_SELECT_BUTTON"},{"label":"Reports","name":"email-reports","component":"inputGroup","level":1,"fields":[{"name":"is_subscribed","label":"Weekly Report","title":"Weekly report","description":"Subscribe to this account\'s Test Weekly Report email","helperText":"User-specific setting to subscribe a user to the account\'s weekly reports email","component":"descriptiveCheckbox","isRequired":true,"initialValue":false,"isDisabled":false}]},{"label":"Event notifications","description":"Select how would you like to receive notifications for each event.","name":"event-notifications","component":"inputGroup","level":1,"fields":[{"label":"testLabel","name":"testName-0","component":"inputGroup","fields":[{"label":"Instant notification","component":"descriptiveCheckbox"},{"label":"Drawer notification","component":"descriptiveCheckbox"}]}]}]}]}]';
    const result = prepareFields(notifPref, emailPref, emailConfig);
    expect(JSON.stringify(result)).toEqual(expected);
  });
});

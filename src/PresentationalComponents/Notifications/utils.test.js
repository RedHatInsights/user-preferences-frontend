import { prepareFields } from './utils';
import {
  SEVERITY_SUBSCRIPTION_GRID,
  TAB_GROUP,
} from '../../SmartComponents/FormComponents/componentTypes';

describe('prepareFields', () => {
  it('does not emit severity grid when enableSeveritySubscriptionGrid is false', () => {
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
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    };
    const result = prepareFields(notifPref, {}, {}, false);
    const tab = result[0].fields[0];
    const eventInput = tab.fields.find((f) => f.name === 'event-notifications');
    const eventGroup = eventInput.fields[0];
    expect(eventGroup.fields[0].component).not.toBe(SEVERITY_SUBSCRIPTION_GRID);
  });

  it('should emit severity subscription grid when all fields define severities and flag is on', () => {
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
    const result = prepareFields(notifPref, {}, {}, true);
    const tab = result[0].fields[0];
    expect(tab.component).toBe(TAB_GROUP);
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

  it('omits per-field description on legacy event notification fields', () => {
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
    const result = prepareFields(notifPref, emailPref, emailConfig, false);
    const advisorTab = result[0].fields[0];
    const [, emailReportsGroup, eventNotificationsGroup] = advisorTab.fields;

    const weeklyReportField = emailReportsGroup.fields[0];
    expect(weeklyReportField.label).toBe('Weekly Report');

    const eventTypeGroup = eventNotificationsGroup.fields[0];
    const [instantField, drawerField] = eventTypeGroup.fields;
    expect(instantField.description).toBeUndefined();
    expect(drawerField.description).toBeUndefined();
  });
});

import omit from 'lodash/omit';
import {
  BULK_SELECT_BUTTON,
  INPUT_GROUP,
  NOTIFICATION_EVENT_CARD,
  TAB_GROUP,
} from '../../SmartComponents/FormComponents/componentTypes';
import {
  buildBulkSeverityGridValue,
  isEventTypePreferenceOn,
  isSeverityGridValue,
} from '../../SmartComponents/FormComponents/severityUtils';

const readEventTypeFieldValue = (values, field) => {
  const m = field.match(
    /^bundles\[([^\]]+)\]\.applications\[([^\]]+)\]\.eventTypes\[([^\]]+)\]$/
  );
  if (!m) {
    return undefined;
  }
  const [, bundle, app, evt] = m;
  return values?.bundles?.[bundle]?.applications?.[app]?.eventTypes?.[evt];
};

// update bulk select button's state after every change
const afterChange = (formOptions, newValue, bundle, app) => {
  if (!newValue) {
    formOptions.change(
      `bundles[${bundle}].applications[${app}].eventTypes[${BULK_SELECT_BUTTON}]`,
      true
    );
  } else {
    const allChecked = Object.entries(
      formOptions.getState().values.bundles?.[bundle]?.applications?.[app]
        .eventTypes || {}
    ).every(
      ([key, value]) =>
        key === BULK_SELECT_BUTTON || isEventTypePreferenceOn(value)
    );
    if (
      allChecked &&
      ((bundle !== 'rhel' && app !== 'advisor') ||
        formOptions.getState().values['is_subscribed'])
    ) {
      formOptions.change(
        `bundles[${bundle}].applications[${app}].eventTypes[${BULK_SELECT_BUTTON}]`,
        false
      );
    }
  }
};

/**
 * @param {Record<string, unknown>} notifPref
 * @param {Record<string, unknown>} emailPref
 * @param {Record<string, unknown>} emailConfig
 * @param {boolean} [enableSeveritySubscriptionGrid=false] Unleash `platform.notifications.severity` — when true, event types that expose a severity grid render the severity subscription grid component.
 */
export const prepareFields = (
  notifPref,
  emailPref,
  emailConfig,
  enableSeveritySubscriptionGrid = false
) =>
  Object.entries(notifPref).reduce((acc, [bundleKey, bundleData]) => {
    return [
      ...acc,
      {
        title: bundleData?.label,
        name: bundleKey,
        fields: Object.entries(bundleData.applications).reduce(
          (acc, [appKey, appData]) => {
            let selectAllActive = true;
            const fields = [
              ...Object.entries(emailPref).reduce(
                (acc, [emailSectionKey, emailSectionValue]) => [
                  ...acc,
                  ...(emailSectionKey === appKey &&
                  emailConfig[emailSectionKey]?.bundle === bundleKey &&
                  emailSectionValue.schema.length !== 0
                    ? [
                        {
                          label: 'Reports',
                          name: 'email-reports',
                          component: INPUT_GROUP,
                          level: 1,
                          fields: emailSectionValue.schema[0]?.fields?.map(
                            (field) => {
                              selectAllActive =
                                selectAllActive && field.initialValue;
                              return {
                                ...field,
                                afterChange: (formOptions, checked) =>
                                  afterChange(
                                    formOptions,
                                    checked,
                                    bundleKey,
                                    appKey
                                  ),
                              };
                            }
                          ),
                        },
                      ] || []
                    : []),
                ],
                []
              ),
              {
                label: 'Event notifications',
                description:
                  'Select how would you like to receive notifications for each event.',
                name: 'event-notifications',
                component: INPUT_GROUP,
                level: 1,
                fields: [
                  ...appData.eventTypes.map((eventType, idx) => {
                    if (enableSeveritySubscriptionGrid) {
                      // Extract event severity from first field's severities array
                      // Find the enabled (not disabled) severity level
                      let eventSeverity;
                      if (eventType.fields?.[0]?.severities) {
                        const enabledSeverity =
                          eventType.fields[0].severities.find(
                            (s) => !s.disabled
                          );
                        eventSeverity = enabledSeverity?.name;
                      }

                      // Map fields to simple subscription field structure
                      // Extract just the subscription type (INSTANT, DRAWER, etc.) from the nested path
                      const subscriptionFields = eventType.fields.map((f) => {
                        // Extract subscription type from name like "bundles[...].emailSubscriptionTypes[INSTANT]"
                        const match = f.name?.match(
                          /emailSubscriptionTypes\[([^\]]+)\]/
                        );
                        const subscriptionType = match
                          ? match[1]
                          : f.name || `field-${idx}`;

                        return {
                          name: subscriptionType,
                          label: f.label || f.title || f.name || 'Notification',
                          initialValue: Boolean(f.initialValue),
                          disabled: Boolean(f.isDisabled || f.disabled),
                        };
                      });

                      // Build initial value as simple object {INSTANT: bool, DRAWER: bool}
                      const initialValue = subscriptionFields.reduce(
                        (acc, f) => {
                          acc[f.name] = f.initialValue;
                          selectAllActive = selectAllActive && f.initialValue;
                          return acc;
                        },
                        {}
                      );

                      return {
                        name: `bundles[${bundleKey}].applications[${appKey}].eventTypes[${eventType.name}]`,
                        component: NOTIFICATION_EVENT_CARD,
                        eventName: eventType.name,
                        eventLabel: eventType.label,
                        severity: eventSeverity,
                        subscriptionFields,
                        bundle: bundleKey,
                        app: appKey,
                        initialValue,
                        afterChange: (formOptions, checked) =>
                          afterChange(formOptions, checked, bundleKey, appKey),
                      };
                    }
                    // Fallback to old layout when feature flag is off
                    return {
                      label: eventType.label,
                      name: `${eventType.name}-${idx}`,
                      component: INPUT_GROUP,
                      fields: eventType.fields.map((field) => {
                        selectAllActive = selectAllActive && field.initialValue;
                        return {
                          ...omit(field, ['description']),
                          afterChange: (formOptions, checked) =>
                            afterChange(
                              formOptions,
                              checked,
                              bundleKey,
                              appKey
                            ),
                        };
                      }),
                    };
                  }),
                ],
              },
            ];
            return [
              ...acc,
              {
                name: appKey,
                bundle: bundleKey,
                app: appKey,
                label: appData.label,
                component: TAB_GROUP,
                fields: [
                  {
                    name: `bundles[${bundleKey}].applications[${appKey}].eventTypes[${BULK_SELECT_BUTTON}]`,
                    section: appKey,
                    initialValue: !selectAllActive,
                    component: BULK_SELECT_BUTTON,
                    onClick: (formOptions, input) => {
                      formOptions.batch(() => {
                        const values = formOptions.getState().values;
                        formOptions.getRegisteredFields().forEach((field) => {
                          if (
                            ((field.includes(bundleKey) &&
                              field.includes(appKey)) ||
                              (field === 'is_subscribed' && // a temporary condition for RHEL Advisor email pref.
                                bundleKey === 'rhel' &&
                                appKey == 'advisor')) &&
                            !field.includes(BULK_SELECT_BUTTON)
                          ) {
                            const current = readEventTypeFieldValue(
                              values,
                              field
                            );
                            let next = input.value;
                            if (isSeverityGridValue(current)) {
                              next = buildBulkSeverityGridValue(
                                current,
                                input.value
                              );
                            } else if (current && typeof current === 'object') {
                              // Handle simple object structure {INSTANT: bool, DAILY: bool}
                              next = Object.keys(current).reduce((acc, key) => {
                                acc[key] = input.value;
                                return acc;
                              }, {});
                            }
                            formOptions.change(field, next);
                          }
                        });
                      });
                      input.onChange(!input.value);
                    },
                  },
                  ...fields,
                ],
              },
            ];
          },
          []
        ),
      },
    ];
  }, []);

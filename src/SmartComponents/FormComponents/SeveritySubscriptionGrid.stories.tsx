import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import {
  FormTemplate,
  componentMapper,
} from '@data-driven-forms/pf4-component-mapper';
import {
  Card,
  CardBody,
  CardTitle,
  Content,
  Title,
} from '@patternfly/react-core';
import { HttpResponse, http } from 'msw';
import { fn } from 'storybook/test';
import SeveritySubscriptionGrid, {
  FREQUENCY_HELP_POPOVER_BODY,
} from './SeveritySubscriptionGrid';
import { INPUT_GROUP, SEVERITY_SUBSCRIPTION_GRID } from './componentTypes';
import InputGroup from './InputGroup';
import { buildInitialSeverityGridValue } from './severitySubscriptionGridUtils';

/**
 * MSW pattern aligned with notifications-frontend stories (e.g. EventTypes.stories.tsx):
 * declare handlers on `parameters.msw.handlers` so the MSW loader applies them per story.
 */
const notificationPreferencesSchemaHandler = http.get(
  '/api/notifications/:apiVersion/user-config/notification-event-type-preference',
  () =>
    HttpResponse.json({
      bundles: {
        rhel: {
          label: 'Red Hat Enterprise Linux',
          applications: {
            compliance: {
              label: 'Compliance',
              eventTypes: [],
            },
          },
        },
      },
    })
);

const meta = {
  title: 'Notifications/User preferences/SeveritySubscriptionGrid',
  component: SeveritySubscriptionGrid,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [notificationPreferencesSchemaHandler],
    },
    docs: {
      description: {
        component: `Notification event preference grid: column headers **Severity** and **Frequency**; **Severity** has a question-circle popover (ratings + learn more link). **Frequency** uses an \`ExclamationTriangleIcon\` trigger (default theme color) with the same PatternFly \`Popover\` wiring as **Severity** (click to open/close, \`position\` top with flip, outside click dismisses, appended to \`document.body\`—see \`COLUMN_HEADER_HELP_POPOVER_DEFAULTS\` in \`SeveritySubscriptionGrid.tsx\`); the popover header is **Important** (text only), then this body (from \`FREQUENCY_HELP_POPOVER_BODY\`): "${FREQUENCY_HELP_POPOVER_BODY}", plus a **Learn more** link to user-preferences documentation. Each row shows a severity (PatternFly severity icon + label) and, under Frequency, labeled checkboxes for each subscription type (e.g. **Instant email**, **Daily digest email**—text comes from \`subscriptionColumns[].label\`). In **My Notifications**, this table is used only when the Unleash flag **\`platform-notifications-severity\`** is on (\`prepareFields\` gates the schema). Supports cascade on enable, backend-disabled severities, and matches nested DDF output from the notifications schema.`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SeveritySubscriptionGrid>;

export default meta;

const subscriptionColumnsStandard = [
  {
    key: 'INSTANT',
    label: 'Instant email',
    severities: [
      { name: 'CRITICAL', initialValue: false, disabled: false },
      { name: 'IMPORTANT', initialValue: false, disabled: false },
      { name: 'MODERATE', initialValue: true, disabled: false },
      { name: 'MINOR', initialValue: false, disabled: false },
      { name: 'NONE', initialValue: false, disabled: false },
      { name: 'UNDEFINED', initialValue: false, disabled: false },
    ],
  },
  {
    key: 'DAILY',
    label: 'Daily digest email',
    severities: [
      { name: 'CRITICAL', initialValue: false, disabled: true },
      { name: 'IMPORTANT', initialValue: false, disabled: false },
      { name: 'MODERATE', initialValue: false, disabled: false },
      { name: 'MINOR', initialValue: false, disabled: false },
      { name: 'NONE', initialValue: false, disabled: false },
      { name: 'UNDEFINED', initialValue: false, disabled: false },
    ],
  },
];

const subscriptionColumnsSecondEvent = [
  {
    key: 'INSTANT',
    label: 'Instant email',
    severities: [
      { name: 'CRITICAL', initialValue: true, disabled: false },
      { name: 'IMPORTANT', initialValue: true, disabled: false },
      { name: 'MODERATE', initialValue: false, disabled: false },
      { name: 'MINOR', initialValue: false, disabled: false },
      { name: 'NONE', initialValue: false, disabled: false },
      { name: 'UNDEFINED', initialValue: false, disabled: false },
    ],
  },
  {
    key: 'DAILY',
    label: 'Daily digest email',
    severities: [
      { name: 'CRITICAL', initialValue: false, disabled: false },
      { name: 'IMPORTANT', initialValue: false, disabled: false },
      { name: 'MODERATE', initialValue: false, disabled: false },
      { name: 'MINOR', initialValue: false, disabled: false },
      { name: 'NONE', initialValue: false, disabled: false },
      { name: 'UNDEFINED', initialValue: false, disabled: false },
    ],
  },
];

const gridMapper = {
  ...componentMapper,
  [INPUT_GROUP]: InputGroup,
  [SEVERITY_SUBSCRIPTION_GRID]: SeveritySubscriptionGrid,
};

/**
 * Single grid in a FormRenderer (isolated component). Daily Critical is disabled for digest.
 */
export const Default: StoryObj<typeof SeveritySubscriptionGrid> = {
  parameters: {
    docs: {
      description: {
        story:
          'One table: **Severity** | **Frequency**. Six severity rows; the Frequency cell on each row has two checkboxes with labels **Instant email** and **Daily digest email** (from the schema). Daily digest for **Critical** is disabled.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <FormRenderer
        schema={{
          fields: [
            {
              component: SEVERITY_SUBSCRIPTION_GRID,
              name: 'bundles[rhel].applications[compliance].eventTypes[DEMO_EVENT]',
              subscriptionColumns: subscriptionColumnsStandard,
              initialValue: buildInitialSeverityGridValue(
                subscriptionColumnsStandard
              ),
            },
          ],
        }}
        componentMapper={gridMapper}
        FormTemplate={FormTemplate}
        onSubmit={fn()}
      />
    </div>
  ),
};

const notificationsPageChrome = (children: React.ReactNode) => (
  <div
    style={{
      padding: 'var(--pf-t--global--spacer--lg)',
      backgroundColor:
        'var(--pf-t--global--background--color--secondary--default)',
    }}
  >
    <Content component="p" className="pf-v6-u-mb-md">
      My Notifications — event notifications (Storybook preview)
    </Content>
    <Title headingLevel="h1" size="2xl" className="pf-v6-u-mb-md">
      My Notifications
    </Title>
    <Card style={{ maxWidth: 960 }}>
      <CardTitle>
        <Title headingLevel="h2" size="xl">
          Red Hat Enterprise Linux — Compliance
        </Title>
      </CardTitle>
      <CardBody>{children}</CardBody>
    </Card>
  </div>
);

/**
 * Nested `inputGroup` structure produced by `prepareFields` in user-preferences (same nesting
 * concept as the notifications app + hybrid console settings flows).
 */
export const NotificationPreferencesSection: StoryObj<
  typeof SeveritySubscriptionGrid
> = {
  parameters: {
    docs: {
      description: {
        story:
          'Same layout as My Notifications: “Event notifications” category, then one nested group per event type. Each grid uses **Severity** | **Frequency** headers; frequency options are labeled checkboxes per subscription type. **Instant email** starts with **Moderate** on so the instant column shows mixed checked state across severities.',
      },
    },
  },
  render: () =>
    notificationsPageChrome(
      <FormRenderer
        schema={{
          fields: [
            {
              component: INPUT_GROUP,
              name: 'event-notifications-story',
              label: 'Event notifications',
              description:
                'Select how would you like to receive notifications for each event.',
              level: 1,
              fields: [
                {
                  component: INPUT_GROUP,
                  label: 'Policy failed',
                  name: 'policy-failed-wrap',
                  fields: [
                    {
                      component: SEVERITY_SUBSCRIPTION_GRID,
                      name: 'bundles[rhel].applications[compliance].eventTypes[POLICY_FAILED]',
                      subscriptionColumns: subscriptionColumnsStandard,
                      initialValue: buildInitialSeverityGridValue(
                        subscriptionColumnsStandard
                      ),
                    },
                  ],
                },
                {
                  component: INPUT_GROUP,
                  label: 'System unreachable',
                  name: 'system-unreachable-wrap',
                  fields: [
                    {
                      component: SEVERITY_SUBSCRIPTION_GRID,
                      name: 'bundles[rhel].applications[compliance].eventTypes[SYSTEM_UNREACHABLE]',
                      subscriptionColumns: subscriptionColumnsSecondEvent,
                      initialValue: buildInitialSeverityGridValue(
                        subscriptionColumnsSecondEvent
                      ),
                    },
                  ],
                },
              ],
            },
          ],
        }}
        componentMapper={gridMapper}
        FormTemplate={FormTemplate}
        onSubmit={fn()}
      />
    ),
};

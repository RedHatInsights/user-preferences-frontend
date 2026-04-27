import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, within } from 'storybook/test';
import { HttpResponse, http } from 'msw';
import Notifications from './Notifications';
import { userPrefInitialState } from './testData';

const notificationsBundles = userPrefInitialState.notificationsReducer.bundles;
const advisorEmailSchema = userPrefInitialState.emailReducer.advisor.schema;

const apiHandlers = [
  http.get(
    /\/api\/notifications\/v1\/user-config\/notification-event-type-preference$/,
    () =>
      HttpResponse.json({
        bundles: notificationsBundles,
      })
  ),
  http.get(/\/api\/insights\/v1\/user-config\/email-preference$/, () =>
    HttpResponse.json(advisorEmailSchema)
  ),
];

const meta = {
  title: 'Pages/My Notifications',
  component: Notifications,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Renders the **My Notifications** preferences page (same component as production).

Uses MSW to mock notification and email schema APIs. The global Storybook preview supplies Redux, Chrome, feature flags (\`useFlag\`), and \`NotificationsProvider\`. \`@scalprum/react-core\` is aliased in Storybook to a noop shim (no module federation).

The Unleash flag \`platform.notifications.severity\` controls both the severity help copy in the page subtitle and whether event types that expose a severity grid render the **Severity × Frequency** table (when the API schema matches).

**Note:** Redux state is the shared registry store; reload the Storybook canvas if another story left stale data.
        `,
      },
    },
    msw: {
      handlers: apiHandlers,
    },
    featureFlags: {
      'platform.notifications.severity': true,
    },
  },
} satisfies Meta<typeof Notifications>;

export default meta;

export const Default = {
  name: 'With severity flag on',
  render: () => <Notifications />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText(
      /Possible notification severity levels include/i,
      {},
      { timeout: 10000 }
    );
    await expect(
      canvas.getByRole('button', { name: 'Critical' })
    ).toBeInTheDocument();
  },
} satisfies StoryObj<typeof meta>;

export const SeverityHelpOff = {
  name: 'With severity flag off',
  render: () => <Notifications />,
  parameters: {
    featureFlags: {
      'platform.notifications.severity': false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Event notifications', {}, { timeout: 10000 });
    expect(
      canvas.queryByText(/Possible notification severity levels include/i)
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole('button', { name: 'Critical' })
    ).not.toBeInTheDocument();
  },
} satisfies StoryObj<typeof meta>;

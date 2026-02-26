import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly-addons.css';
import './storybook.css';
import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import registry from '../src/Utilities/store';
import { ChromeProvider, FeatureFlagsProvider, type ChromeConfig, type FeatureFlagsConfig } from './context-providers';
import { initialize, mswLoader } from 'msw-storybook-addon';

// Mock insights global for Storybook
declare global {
  var insights: {
    chrome: {
      getEnvironment: () => string;
    };
  };
}

// Mock global insights object for libraries that access it directly
const mockInsightsChrome = {
  getEnvironment: () => 'prod',
  getUserPermissions: () => Promise.resolve([
    { permission: 'user-preferences:*:*', resourceDefinitions: [] },
  ]),
  auth: {
    getUser: () => Promise.resolve({
      identity: {
        user: {
          username: 'test-user',
          email: 'test@redhat.com',
          is_org_admin: true,
          is_internal: false,
        },
      },
    }),
    getToken: () => Promise.resolve('mock-jwt-token-12345'),
  },
};

if (typeof global !== 'undefined') {
  (global as any).insights = { chrome: mockInsightsChrome };
} else if (typeof window !== 'undefined') {
  (window as any).insights = { chrome: mockInsightsChrome };
}

const preview: Preview = {
  beforeAll: async () => {
    initialize({ onUnhandledRequest: 'warn' });
  },
  loaders: [mswLoader],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Documentation', 'Components', '*'],
      },
    },
    layout: 'fullscreen',
    chromatic: { delay: 300 },
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Default configurations for all stories (can be overridden per story)
    chrome: {
      environment: 'prod',
    },
    featureFlags: {},
  },
  decorators: [
    (Story, { parameters, args }) => {
      // Merge chrome config from parameters with any arg overrides
      const chromeConfig: ChromeConfig = {
        environment: 'prod',
        ...parameters.chrome,
        ...(args.environment !== undefined && { environment: args.environment }),
      };

      const featureFlags: FeatureFlagsConfig = {
        ...parameters.featureFlags,
      };

      return (
        <Provider store={registry.getStore()}>
          <ChromeProvider value={chromeConfig}>
            <FeatureFlagsProvider value={featureFlags}>
              <MemoryRouter>
                <Fragment>
                  <NotificationsProvider>
                    <Story />
                  </NotificationsProvider>
                </Fragment>
              </MemoryRouter>
            </FeatureFlagsProvider>
          </ChromeProvider>
        </Provider>
      );
    },
  ],
};

export default preview;

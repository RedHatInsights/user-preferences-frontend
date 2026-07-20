import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly-addons.css';
import '@redhat-cloud-services/hcc-storybook-hub/css/storybook.css';
import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import registry from '../src/Utilities/store';
import { HccStorybookProvider, hccPreviewDefaults } from '@redhat-cloud-services/hcc-storybook-hub';

const preview: Preview = {
  ...hccPreviewDefaults,
  parameters: {
    ...hccPreviewDefaults.parameters,
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Documentation', 'Components', '*'],
      },
    },
    chromatic: { delay: 300 },
    actions: { argTypesRegex: '^on.*' },
  },
  decorators: [
    (Story, { parameters }) => {
      return (
        <Provider store={registry.getStore()}>
          <HccStorybookProvider
            bundle="settings"
            app="user-preferences"
            environment={parameters.chrome?.environment ?? 'stage'}
            isOrgAdmin={parameters.chrome?.isOrgAdmin ?? true}
            permissions={parameters.chrome?.permissions ?? ['user-preferences:*:*']}
            featureFlags={parameters.featureFlags ?? {}}
          >
            <MemoryRouter>
              <Fragment>
                <NotificationsProvider>
                  <Story />
                </NotificationsProvider>
              </Fragment>
            </MemoryRouter>
          </HccStorybookProvider>
        </Provider>
      );
    },
  ],
};

export default preview;

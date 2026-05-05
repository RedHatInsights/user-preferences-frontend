import React from 'react';
import { render, screen } from '@testing-library/react';
import { useFlag } from '@unleash/proxy-client-react';
import App from './App';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    auth: { getUser: () => Promise.resolve({ identity: {} }) },
    updateDocumentTitle: jest.fn(),
  }),
}));

// eslint-disable-next-line react/display-name
jest.mock('./Routing', () => () => <div data-testid="routing">Routing</div>);

describe('App', () => {
  afterEach(() => {
    useFlag.mockReset();
  });

  it('renders empty state when environment flag is disabled', () => {
    useFlag.mockReturnValue(false);
    render(<App />);
    expect(
      screen.getByText(
        'Notification preferences are not available in this environment'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'This feature is not enabled for your current environment.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByTestId('routing')).not.toBeInTheDocument();
  });

  it('renders application when environment flag is enabled', () => {
    useFlag.mockReturnValue(true);
    render(<App />);
    expect(screen.getByTestId('routing')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Notification preferences are not available in this environment'
      )
    ).not.toBeInTheDocument();
  });
});

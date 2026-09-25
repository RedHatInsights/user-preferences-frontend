import React from 'react';
import { act, render } from '@testing-library/react';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import NotificationTemplate from './NotificationTemplate';

const mockPush = jest.fn();
const mockBlock = jest.fn(() => jest.fn());

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({ chromeHistory: { push: mockPush, block: mockBlock } }),
}));

jest.mock('../shared/FormButtons', () => ({
  __esModule: true,
  default: () => null,
}));

const renderTemplate = ({ dirty = false } = {}) =>
  render(
    <Form onSubmit={() => undefined}>
      {() => (
        <RendererContext.Provider
          value={{
            formOptions: {
              renderForm: () => {},
              getState: () => ({ dirty }),
              handleSubmit: () => {},
            },
          }}
        >
          <NotificationTemplate schema={{ title: null }} formFields={[]} />
        </RendererContext.Provider>
      )}
    </Form>
  );

describe('NotificationTemplate', () => {
  afterEach(() => {
    mockPush.mockReset();
    mockBlock.mockReset();
    mockBlock.mockImplementation(() => jest.fn());
  });

  // RHCLOUD-51540: on mount `triggerExit.pathname` is still '', and
  // `chromeHistory.push('')` resolves to the current pathname with the query string
  // dropped. That silently discarded deep-link params such as
  // `?bundle=console&app=rbac` coming from the notifications drawer.
  it('does not navigate on mount when there is no intended exit target', () => {
    renderTemplate();

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('registers a navigation block listener', () => {
    renderTemplate();

    expect(mockBlock).toHaveBeenCalled();
  });

  it('navigates to the intended page once block reports one', () => {
    renderTemplate();

    const blocker = mockBlock.mock.calls[0][0];
    act(() => {
      blocker({
        location: { pathname: '/settings/notifications', search: '' },
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/notifications');
  });

  it('keeps the search string when the intended page has one', () => {
    renderTemplate();

    const blocker = mockBlock.mock.calls[0][0];
    act(() => {
      blocker({
        location: {
          pathname: '/settings/notifications',
          search: '?bundle=console',
        },
      });
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/settings/notifications',
      search: '?bundle=console',
    });
  });
});

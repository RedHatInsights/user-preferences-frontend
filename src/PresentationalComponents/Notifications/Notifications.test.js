/* eslint-disable react/prop-types */
import * as API from '../../api';
import * as EmailActions from '../../redux/actions/email-actions';
import * as NotificationsActions from '../../redux/actions/notifications-actions';
import * as functions from '../../Utilities/functions';

import {
  GET_NOTIFICATIONS_SCHEMA,
  SAVE_EMAIL_SCHEMA,
  SAVE_NOTIFICATION_SCHEMA,
} from '../../redux/action-types';
import {
  act,
  fireEvent,
  getAllByRole,
  getByLabelText,
  getByRole,
  getByText,
  queryByText,
  render,
  screen,
} from '@testing-library/react';
import { calculateEmailConfigResponse, userPrefInitialState } from './testData';

import { MemoryRouter } from 'react-router-dom';
import Notifications from './Notifications';
import { Provider } from 'react-redux';
import React from 'react';
import { ScalprumProvider } from '@scalprum/react-core';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';

const mockedNavigate = jest.fn();
const mockedLocation = jest.fn(() => ({}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedLocation,
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    chromeHistory: {
      push: jest.fn(),
      block: jest.fn(() => jest.fn()),
    },
    auth: { getUser: () => Promise.resolve() },
  });
});

const NotificationsWrapper = ({ store, children }) => (
  <ScalprumProvider
    api={{
      chrome: {
        getEnvironment: () => '',
        isProd: () => false,
        isBeta: () => false,
      },
    }}
  >
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  </ScalprumProvider>
);

xdescribe('Notifications tests', () => {
  const middlewares = [promiseMiddleware];
  let mockStore;
  let initialState;

  const calculateEmailConfig = jest.spyOn(functions, 'calculateEmailConfig');
  const getApplicationSchema = jest.spyOn(API, 'getApplicationSchema');
  const getNotificationsSchemaSpy = jest.spyOn(
    NotificationsActions,
    'getNotificationsSchema'
  );
  const saveNotificationValues = jest.spyOn(
    NotificationsActions,
    'saveNotificationValues'
  );
  const saveEmailValues = jest.spyOn(EmailActions, 'saveEmailValues');
  const emptyResolve = Promise.resolve({
    fields: [],
  });

  beforeEach(() => {
    mockStore = configureStore(middlewares);
    initialState = userPrefInitialState;
  });

  afterEach(() => {
    calculateEmailConfig.mockReset();
    getApplicationSchema.mockReset();
    getNotificationsSchemaSpy.mockReset();
    saveNotificationValues.mockReset();
    saveEmailValues.mockReset();
    mockedNavigate.mockReset();
    mockedLocation.mockReset();
  });

  it('should render correctly', async () => {
    getApplicationSchema.mockImplementation(() => emptyResolve);
    getNotificationsSchemaSpy.mockImplementation(() => ({
      type: GET_NOTIFICATIONS_SCHEMA,
      payload: Promise.resolve({
        bundles: {},
      }),
    }));
    let wrapper;
    await act(async () => {
      wrapper = render(
        <NotificationsWrapper store={mockStore(initialState)}>
          <Notifications />
        </NotificationsWrapper>
      );
    });
    expect(wrapper.container).toMatchSnapshot();
  });

  it('should render empty state on filter', async () => {
    getApplicationSchema.mockImplementation(() => emptyResolve);
    getNotificationsSchemaSpy.mockImplementation(() => ({
      type: GET_NOTIFICATIONS_SCHEMA,
      payload: Promise.resolve({
        bundles: {},
      }),
    }));
    const wrapper = render(
      <Provider store={mockStore(initialState)}>
        <Notifications />
      </Provider>
    );
    const input = screen.getByPlaceholderText('Search services');
    fireEvent.change(input, {
      target: { value: 'someText' },
    });
    expect(
      getByText(wrapper.container, 'No matching services found')
    ).toBeVisible();
    fireEvent.click(getByText(wrapper.container, 'Clear filters'));
    expect(
      queryByText(wrapper.container, 'No matching services found')
    ).toEqual(null);
    expect(getByText(wrapper.container, 'Console')).toBeVisible();
  });

  it('should submit correctly', async () => {
    getApplicationSchema.mockImplementation(() => emptyResolve);
    calculateEmailConfig.mockImplementation(() => calculateEmailConfigResponse);
    getNotificationsSchemaSpy.mockImplementation(() => ({
      type: GET_NOTIFICATIONS_SCHEMA,
      payload: Promise.resolve({
        bundles: {},
      }),
    }));
    saveNotificationValues.mockImplementation(() => ({
      type: SAVE_NOTIFICATION_SCHEMA,
      payload: Promise.resolve({}),
    }));
    saveEmailValues.mockImplementation(() => ({
      type: SAVE_EMAIL_SCHEMA,
      payload: Promise.resolve({}),
    }));
    let wrapper;
    await act(async () => {
      wrapper = render(
        <Provider store={mockStore(initialState)}>
          <Notifications />
        </Provider>
      );
    });
    expect(queryByText(wrapper.container, 'Save')).toEqual(null);
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(0));
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(1));
    expect(getByText(wrapper.container, 'Save')).toBeEnabled();
    fireEvent.click(getByText(wrapper.container, 'Cancel'));
    expect(queryByText(wrapper.container, 'Save')).toEqual(null);
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(0));
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(1));
    fireEvent.click(getByText(wrapper.container, 'Save'));
    expect(queryByText(wrapper.container, 'Save')).toEqual(null);
    expect(saveNotificationValues).toHaveBeenCalledTimes(1);
    expect(saveNotificationValues).toHaveBeenCalledWith({
      bundles: {
        console: {
          applications: {
            sources: {
              eventTypes: {},
            },
          },
        },
      },
    });
    expect(saveEmailValues).toHaveBeenCalledTimes(1);
    expect(saveEmailValues).toHaveBeenCalledWith({
      apiName: 'insights',
      application: 'advisor',
      url: '/user-preferences/',
      values: { is_subscribed: true },
    });
  });
});

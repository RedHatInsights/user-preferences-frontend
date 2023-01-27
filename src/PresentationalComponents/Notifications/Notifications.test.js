import React from 'react';
import {
  act,
  fireEvent,
  getAllByRole,
  getByRole,
  getByText,
  queryByText,
  render,
} from '@testing-library/react';
import Notifications from './Notifications';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import * as API from '../../api';
import * as NotificationsActions from '../../redux/actions/notifications-actions';
import * as EmailActions from '../../redux/actions/email-actions';
import { Provider } from 'react-redux';
import {
  GET_NOTIFICATION_SCHEMAS,
  SAVE_EMAIL_SCHEMA,
  SAVE_NOTIFICATION_SCHEMA,
} from '../../redux/action-types';
import * as functions from '../../Utilities/functions';
import { calculateEmailConfigResponse, userPrefInitialState } from './testData';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    location: {},
  }),
}));

describe('Notifications tests', () => {
  const middlewares = [promiseMiddleware];
  let mockStore;
  let initialState;

  const calculateEmailConfig = jest.spyOn(functions, 'calculateEmailConfig');
  const getApplicationSchema = jest.spyOn(API, 'getApplicationSchema');
  const getNotificationSchemasSpy = jest.spyOn(
    NotificationsActions,
    'getNotificationSchemas'
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
    getNotificationSchemasSpy.mockReset();
    saveNotificationValues.mockReset();
    saveEmailValues.mockReset();
  });

  it('should render correctly', async () => {
    getApplicationSchema.mockImplementation(() => emptyResolve);
    calculateEmailConfig.mockImplementation(() =>
      Promise.resolve(calculateEmailConfigResponse)
    );
    getNotificationSchemasSpy.mockImplementation(() => ({
      type: GET_NOTIFICATION_SCHEMAS,
      payload: Promise.resolve({
        fields: [],
      }),
    }));
    let wrapper;
    await act(async () => {
      wrapper = render(
        <Provider store={mockStore(initialState)}>
          <Notifications />
        </Provider>
      );
    });
    expect(wrapper.container).toMatchSnapshot();
  });

  it('should render empty state on filter', async () => {
    getApplicationSchema.mockImplementation(() => emptyResolve);
    calculateEmailConfig.mockImplementation(() =>
      Promise.resolve(calculateEmailConfigResponse)
    );
    getNotificationSchemasSpy.mockImplementation(() => ({
      type: GET_NOTIFICATION_SCHEMAS,
      payload: Promise.resolve({
        fields: [],
      }),
    }));
    let wrapper;
    await act(async () => {
      wrapper = render(
        <Provider store={mockStore(initialState)}>
          <Notifications />
        </Provider>
      );
    });
    fireEvent.change(getByRole(wrapper.container, 'searchbox'), {
      target: { value: 'someText' },
    });
    expect(
      getByText(wrapper.container, 'No matching applications found')
    ).toBeVisible();
    fireEvent.click(getByText(wrapper.container, 'Clear filters'));
    expect(
      queryByText(wrapper.container, 'No matching applications found')
    ).toEqual(null);
    expect(getByText(wrapper.container, 'Console')).toBeVisible();
  });

  it('should submit correctly', async () => {
    getApplicationSchema.mockImplementation(() => emptyResolve);
    calculateEmailConfig.mockImplementation(() =>
      Promise.resolve(calculateEmailConfigResponse)
    );
    getNotificationSchemasSpy.mockImplementation(() => ({
      type: GET_NOTIFICATION_SCHEMAS,
      payload: Promise.resolve({
        fields: [],
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
    expect(getByText(wrapper.container, 'Save')).toBeDisabled();
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(0));
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(1));
    expect(getByText(wrapper.container, 'Save')).toBeEnabled();
    fireEvent.click(getByText(wrapper.container, 'Save'));
    expect(getByText(wrapper.container, 'Save')).toBeDisabled();
    expect(saveNotificationValues).toHaveBeenCalledTimes(1);
    expect(saveNotificationValues).toHaveBeenCalledWith({
      bundleName: 'application-services',
      values: {
        bundles: {
          'application-services': {
            applications: {
              rhosak: {
                notifications: {
                  INSTANT: false,
                },
              },
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
      values: { is_subscribed: false },
    });
  });
});

import React, { useEffect, useRef, useState } from 'react';
import omit from 'lodash/omit';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import { Text } from '@patternfly/react-core';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNotificationSchemas,
  saveNotificationValues,
} from '../../redux/actions/notifications-actions';
import { saveEmailValues } from '../../redux/actions/email-actions';
import { getApplicationSchema } from '../../api';
import {
  calculateEmailConfig,
  notificationConfigForBundle,
} from '../../Utilities/functions';
import {
  DATA_LIST,
  DESCRIPTIVE_CHECKBOX,
  DataListLayout,
  DescriptiveCheckbox,
  LOADER,
  Loader,
} from '../../SmartComponents/FormComponents';
import config from '../../config/config.json';
import FormTabs from './Tabs';
import FormTabGroup from './TabGroup';
import { prepareFields } from './utils';
import { UNSUBSCRIBE_ALL } from '../../Utilities/constants';
import FormTemplate from './NotificationTemplate';
import './notifications.scss';

const Notifications = () => {
  const dispatch = useDispatch();
  const titleRef = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const [emailConfig, setEmailConfig] = useState({});

  const emailPref = useSelector(({ emailReducer }) => emailReducer);
  const { bundles: notifPref } = useSelector(({ notificationsReducer }) => ({
    bundles: {},
    ...notificationsReducer,
  }));

  useEffect(() => {
    setLoading(true);
    (async () => {
      await insights.chrome.auth.getUser();
      setEmailConfig(await calculateEmailConfig(config, dispatch));
      const promises = Object.keys(config['notification-preference']).map(
        (bundleName) =>
          getApplicationSchema(
            notificationConfigForBundle(bundleName)?.application,
            undefined,
            notificationConfigForBundle(bundleName)?.resourceType
          ).then((data) => ({
            data,
            bundleName,
          }))
      );
      Promise.all(promises).then((values) => {
        const newValues = values.reduce(
          (acc, { data, bundleName }) => ({
            ...acc,
            [bundleName]: data?.fields[0],
          }),
          {}
        );
        dispatch(getNotificationSchemas(newValues));
        setLoading(false);
      });
    })();
  }, []);

  const saveValues = (values, form) => {
    const notifToSubmit = Object.entries(notifPref).reduce((acc, curr) => {
      const temp = curr[1].sections
        .filter((item) =>
          Object.entries(form.getState().dirtyFields).some(
            ([key, value]) =>
              key.includes(curr[0]) &&
              key.includes(item.name) &&
              key.includes('notifications') &&
              value
          )
        )
        .map((item) => item.name);
      const tempToSubmit = [...new Set([...(acc?.[curr[0]] || []), ...temp])];
      return {
        ...acc,
        ...(tempToSubmit.length > 0 ? { [curr[0]]: tempToSubmit } : {}),
      };
    }, {});
    const promises = Object.keys(notifToSubmit).map((bundleName) =>
      dispatch(
        saveNotificationValues({
          bundleName,
          values: {
            bundles: {
              [bundleName]: {
                applications: Object.entries(
                  values.bundles[bundleName].applications
                ).reduce(
                  (acc, [key, value]) => ({
                    ...acc,
                    [key]: {
                      notifications: omit(value.notifications, UNSUBSCRIBE_ALL),
                    },
                  }),
                  {}
                ),
              },
            },
          },
        })
      )
    );
    // temporary submitting of RHEL Advisor email pref.
    if (form.getState().dirtyFields['is_subscribed']) {
      const { url, apiName } = emailConfig['advisor'];
      const action = saveEmailValues({
        application: 'advisor',
        values: { is_subscribed: values.is_subscribed },
        url,
        apiName,
      });
      promises.push(dispatch(action));
    }
    Promise.all(promises)
      .then(() => {
        dispatch(
          addNotification({
            dismissable: true,
            variant: 'success',
            title: 'Notification preferences successfully saved',
          })
        );
      })
      .catch(() => {
        dispatch(
          addNotification({
            dismissable: true,
            variant: 'danger',
            title: 'Notification preferences unsuccessfully saved',
          })
        );
      });
  };

  return !isLoading ? (
    <div id="notifications-container" className="pref-notifications--container">
      <div className="pref-notifications--wrapper">
        <div id="notifications-grid" className="pref-notifications--grid">
          <div ref={titleRef} className="pref-notifications--head">
            <PageHeaderTitle
              className="pref-notifications--title sticky"
              title="My Notifications"
            />
            <Text className="pref-notifications--subtitle">
              This service allows you to opt-in and out of receiving
              notifications. Your Organization Administrator has configured
              which notifications you can or can not receive in their{' '}
              <a href={`/settings/notifications`}>Settings</a>.
            </Text>
          </div>

          <FormRenderer
            componentMapper={{
              ...componentMapper,
              [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
              [LOADER]: Loader,
              [DATA_LIST]: DataListLayout,
              tabs: FormTabs,
              tabGroup: FormTabGroup,
            }}
            FormTemplate={FormTemplate}
            schema={{
              fields: [
                {
                  component: 'tabs',
                  name: 'notifTabs',
                  titleRef,
                  fields: prepareFields(notifPref, emailPref, emailConfig),
                },
              ],
            }}
            onSubmit={saveValues}
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default Notifications;

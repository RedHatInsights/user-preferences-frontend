import React, { useEffect, useRef, useState } from 'react';
import omit from 'lodash/omit';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import { Bullseye, Button, Content, Spinner } from '@patternfly/react-core';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useNotifications } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { ScalprumComponent } from '@scalprum/react-core';
import { useDispatch, useSelector } from 'react-redux';
import { useStore } from 'react-redux';
import {
  getNotificationsSchema,
  saveNotificationValues,
} from '../../redux/actions/notifications-actions';
import { saveEmailValues } from '../../redux/actions/email-actions';
import { calculateEmailConfig } from '../../Utilities/functions';
import {
  BULK_SELECT_BUTTON,
  BulkSelectButton,
  DATA_LIST,
  DESCRIPTIVE_CHECKBOX,
  DataListLayout,
  DescriptiveCheckbox,
  FORM_TABS,
  INPUT_GROUP,
  InputGroup,
  LOADER,
  Loader,
  TAB_GROUP,
} from '../../SmartComponents/FormComponents';
import config from '../../config/config.json';
import FormTabs from './Tabs';
import FormTabGroup from './TabGroup';
import { prepareFields } from './utils';
import FormTemplate from './NotificationTemplate';
import './notifications.scss';
import { useLoadModule, useRemoteHook } from '@scalprum/react-core';

const Notifications = () => {
  const { auth } = useChrome();
  const dispatch = useDispatch();
  const { addNotification } = useNotifications();
  const titleRef = useRef(null);
  const [emailConfig, setEmailConfig] = useState({});
  const store = useStore();

  const emailPref = useSelector(({ emailReducer }) => emailReducer);
  const { bundles: notifPref, loaded } = useSelector(
    ({ notificationsReducer }) => ({
      ...notificationsReducer,
      bundles: Object.entries(notificationsReducer?.bundles || {})?.reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value,
        }),
        {}
      ),
    })
  );

  useEffect(() => {
    (async () => {
      await auth.getUser();
      setEmailConfig(calculateEmailConfig(config, dispatch));
      dispatch(getNotificationsSchema());
    })();
  }, []);

  const { hookResult: vaHookResult, loading: vaLoading } = useRemoteHook({
    scope: 'virtualAssistant',
    module: './state/globalState',
    importName: 'useVirtualAssistant',
  });

  const [Models] = useLoadModule(
    {
      scope: 'virtualAssistant',
      module: './state/globalState',
      importName: 'Models',
    },
    {}
  );

  const saveValues = (values, formApi) => {
    const notificationValues = {
      bundles: Object.entries(values.bundles).reduce(
        (acc, [bundleName, bundleData]) => ({
          ...acc,
          [bundleName]: {
            applications: Object.entries(bundleData.applications).reduce(
              (acc, [appName, appData]) => ({
                ...acc,
                [appName]: {
                  eventTypes: omit(appData.eventTypes, BULK_SELECT_BUTTON),
                },
              }),
              {}
            ),
          },
        }),
        {}
      ),
    };
    const promises = [dispatch(saveNotificationValues(notificationValues))];
    const submitEmail = formApi.getState().dirtyFields['is_subscribed'];
    // temporary submitting of RHEL Advisor email pref.
    if (submitEmail) {
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
        submitEmail && setEmailConfig(calculateEmailConfig(config, dispatch));
        dispatch(getNotificationsSchema());
        addNotification({
          dismissable: true,
          variant: 'success',
          title: 'Notification preferences successfully saved',
        });
      })
      .catch(() => {
        addNotification({
          dismissable: true,
          variant: 'danger',
          title: 'Notification preferences unsuccessfully saved',
        });
      });
  };

  return loaded && Object.values(emailPref).every((value) => value.loaded) ? (
    <div id="notifications-container" className="pref-notifications--container">
      <div className="pref-notifications--wrapper">
        <div id="notifications-grid" className="pref-notifications--grid">
          <div ref={titleRef} className="pref-notifications--head">
            <PageHeaderTitle
              className="pref-notifications--title sticky"
              title="My Notifications"
            />
            <Content
              component="p"
              className="pref-notifications--subtitle pf-v6-u-font-size-md"
            >
              Opt in or out of receiving notifications, and choose how you want
              to be notified. Your Organization Administrator has configured
              which notifications you can or can’t receive on their end.{' '}
              <Button
                onClick={() => {
                  if (!vaLoading && Models) {
                    const [, setState] = vaHookResult || [];
                    console.log(Models);
                    setState({
                      isOpen: true,
                      currentModel: Models?.VA,
                      message:
                        'Contact my organization administrator to update which notifications I receive',
                    });
                  }
                }}
                variant="link"
                isInline
              >
                Contact your Organization Administrator
              </Button>{' '}
              to have these settings updated..
              <ScalprumComponent
                module="./ConnectedTimeConfig"
                scope="notifications"
                store={store}
              />
            </Content>
          </div>

          <FormRenderer
            componentMapper={{
              ...componentMapper,
              [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
              [BULK_SELECT_BUTTON]: BulkSelectButton,
              [LOADER]: Loader,
              [DATA_LIST]: DataListLayout,
              [INPUT_GROUP]: InputGroup,
              [FORM_TABS]: FormTabs,
              [TAB_GROUP]: FormTabGroup,
            }}
            FormTemplate={FormTemplate}
            schema={{
              fields: [
                {
                  component: FORM_TABS,
                  name: 'notifTabs',
                  titleRef,
                  bundles: notifPref,
                  fields: prepareFields(notifPref, emailPref, emailConfig),
                },
              ],
            }}
            onSubmit={saveValues}
          />
        </div>
      </div>
    </div>
  ) : (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );
};

export default Notifications;

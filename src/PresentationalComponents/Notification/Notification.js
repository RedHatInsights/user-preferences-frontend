import React, { useCallback, useEffect, useMemo } from 'react';
import './notification.scss';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { useParams } from 'react-router-dom';
import {
  Bullseye,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Stack,
  Split,
  SplitItem,
  StackItem,
} from '@patternfly/react-core';
import { useChromePush } from '../../Utilities/functions';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import {
  DATA_LIST,
  DataListLayout,
  DESCRIPTIVE_CHECKBOX,
  DescriptiveCheckbox,
  Loader,
  LOADER,
} from '../../SmartComponents/FormComponents';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import FormButtons from '../shared/FormButtons';
import FormRender from '@data-driven-forms/react-form-renderer/form-renderer';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationSchema, saveNotificationValues } from '../../actions';
import { notificationConfigForBundle } from '../../Utilities/functions';
import { notificationPreferences, register } from '../../store';
import unsubscribe from '../../config/data/unsubscribe.json';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const Notification = () => {
  const { bundleName } = useParams();
  const navigateTo = useChromePush();
  const dispatch = useDispatch();
  const store = useSelector(
    ({ notificationPreferences }) => notificationPreferences
  );
  const bundleDisplayTitle = notificationConfigForBundle(bundleName)?.title;

  useEffect(() => {
    register(notificationPreferences);
  }, []);

  useEffect(() => {
    (async () => {
      await insights.chrome.auth.getUser();
      if (bundleName) {
        dispatch(getNotificationSchema({ bundleName }));
      }
    })();
  }, [bundleName]);

  const { isLoaded, schema } = useMemo(() => {
    if (store?.loaded) {
      const schema = { ...store.schema };
      if (schema.fields) {
        schema.fields = [...schema.fields];
        schema.fields[0].sections = [...schema.fields[0].sections];
        schema.fields[0].sections.push({
          fields: unsubscribe,
        });
      } else {
        schema.fields = [];
      }

      return {
        isLoaded: true,
        schema: schema,
      };
    }
    return {
      isLoaded: false,
      schema: [],
    };
  }, [store]);

  const saveValues = useCallback(
    async ({ unsubscribe, ...values }) => {
      const action = saveNotificationValues({ bundleName, values });
      dispatch(action);
      try {
        await action.payload;
        dispatch(
          addNotification({
            dismissable: false,
            variant: 'success',
            title: `Notification preferences successfully saved`,
          })
        );
      } catch (e) {
        dispatch(
          addNotification({
            dismissable: false,
            variant: 'danger',
            title: `Notification preferences unsuccessfully saved`,
          })
        );
      }
    },
    [bundleName]
  );

  return (
    <React.Fragment>
      <PageHeader>
        <Split>
          <SplitItem isFilled>
            <PageHeaderTitle
              className="notif-page-header"
              title={`My Notifications | ${bundleDisplayTitle}`}
            />
            <StackItem>
              This service allows you to opt-in and out of receiving
              notifications. Your Organization Administrator has configured
              which notifications you can or can not receive in their
              <a
                onClick={(e) =>
                  navigateTo(e, `/settings/notifications/${bundleName}`)
                }
                href={`/settings/notifications/${bundleName}`}
              >
                Settings
              </a>
              .
            </StackItem>
          </SplitItem>
        </Split>
      </PageHeader>
      <Main className="pref-notification">
        <Stack hasGutter>
          <StackItem>
            <Card ouiaId="user-pref-notification-subscriptions-card">
              <CardHeader className="pf-u-pb-0"></CardHeader>
              <CardBody className="pref-notification_form">
                {isLoaded ? (
                  <FormRender
                    componentMapper={{
                      ...componentMapper,
                      [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
                      [LOADER]: Loader,
                      [DATA_LIST]: DataListLayout,
                    }}
                    FormTemplate={(props) => (
                      <FormTemplate {...props} FormButtons={FormButtons} />
                    )}
                    schema={schema}
                    onSubmit={saveValues}
                  />
                ) : (
                  <Bullseye>
                    <Spinner />
                  </Bullseye>
                )}
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </Main>
    </React.Fragment>
  );
};

export default Notification;

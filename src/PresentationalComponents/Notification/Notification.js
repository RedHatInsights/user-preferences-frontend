import YourInformation from '../shared/YourInformation';
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
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
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
import { notificationPreferences, register } from '../../store';
import unsubscribe from '../../config/data/unsubscribe.json';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const Notification = () => {
  const { bundleName } = useParams();
  const dispatch = useDispatch();
  const store = useSelector(
    ({ notificationPreferences }) => notificationPreferences
  );

  useEffect(() => {
    register(notificationPreferences);
  }, []);

  useEffect(() => {
    if (bundleName) {
      dispatch(getNotificationSchema({ bundleName }));
    }
  }, [bundleName]);

  const { isLoaded, schema } = useMemo(() => {
    if (store?.loaded) {
      const schema = { ...store.schema };
      schema.fields = [...schema.fields];
      schema.fields[0].sections = [...schema.fields[0].sections];
      schema.fields[0].sections.push({
        fields: unsubscribe,
      });

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
        <PageHeaderTitle title="Notification Insights" />
      </PageHeader>
      <Main className="pref-notification">
        <Stack hasGutter>
          <StackItem>
            <YourInformation />
          </StackItem>
          <StackItem>
            <Card ouiaId="user-pref-notification-subscriptions-card">
              <CardHeader className="pf-u-pb-0">
                <TextContent>
                  <Text component={TextVariants.h2}>Notifications</Text>
                  <Text component={TextVariants.p}>
                    Select the cloud.redhat.com notifications you want to
                    receive.
                  </Text>
                </TextContent>
              </CardHeader>
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

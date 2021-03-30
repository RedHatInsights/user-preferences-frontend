import React, { useState } from 'react';
import './email.scss';
import { useSelector, useDispatch } from 'react-redux';
import {
  componentMapper,
  FormTemplate,
} from '@data-driven-forms/pf4-component-mapper';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  Card,
  CardBody,
  Stack,
  StackItem,
  CardHeader,
  TextContent,
  Text,
  TextVariants,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import FormRender from '@data-driven-forms/react-form-renderer/form-renderer';
import {
  DESCRIPTIVE_CHECKBOX,
  DATA_LIST,
  LOADER,
  DescriptiveCheckbox,
  DataListLayout,
  Loader,
} from '../../SmartComponents/FormComponents';
import config from '../../config/config.json';
import { saveEmailValues } from '../../actions';
import {
  calculateEmailConfig,
  getSection,
  distributeSuccessError,
  dispatchMessages,
} from '../../Utilities/functions';
import FormButtons from '../shared/FormButtons';
import YourInformation from '../shared/YourInformation';
import useLoaded from '../shared/useLoaded';
import { emailPreferences, register } from '../../store';

const Email = () => {
  const dispatch = useDispatch();

  const [emailConfig, setEmailConfig] = useState({});
  const isLoaded = useLoaded(async () => {
    await insights.chrome.auth.getUser();
    register(emailPreferences);
    setEmailConfig(await calculateEmailConfig(config, dispatch));
  });

  const store = useSelector(({ emailPreferences }) => emailPreferences);

  const saveValues = async ({ unsubscribe, ...values }) => {
    const promises = Object.entries(emailConfig)
      .filter(([, { isVisible }]) => isVisible === true)
      .map(([application, { localFile, schema, url, apiName }]) => {
        if (
          !localFile &&
          !schema &&
          store?.[application]?.schema &&
          Object.keys(store?.[application]?.schema).length > 0
        ) {
          const action = saveEmailValues({ application, values, url, apiName });
          dispatch(action);

          return {
            promise: action.payload,
            meta: action.meta,
          };
        }
      })
      .filter(Boolean);

    const { success, error } = await distributeSuccessError(promises);
    dispatchMessages(dispatch, success, error);
  };

  const calculateSection = (key, schema) => {
    return getSection(key, schema, store?.[key], (isVisible) => {
      const { ...config } = emailConfig;
      if (isVisible === false) {
        delete config[key];
      } else {
        config[key] = {
          ...config[key],
          isVisible,
        };
      }

      setEmailConfig(config);
    });
  };

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Email preferences" />
      </PageHeader>
      <Main className="pref-email">
        <Stack hasGutter>
          <StackItem>
            <YourInformation />
          </StackItem>
          <StackItem>
            <Card ouiaId="user-pref-email-subscriptions-card">
              <CardHeader className="pf-u-pb-0">
                <TextContent>
                  <Text component={TextVariants.h2}>Email subscriptions</Text>
                  <Text component={TextVariants.p}>
                    Select the cloud.redhat.com emails you want to receive.
                  </Text>
                </TextContent>
              </CardHeader>
              <CardBody className="pref-email_form">
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
                    schema={{
                      fields: [
                        {
                          name: 'email-preferences',
                          component: DATA_LIST,
                          sections: Object.entries(
                            emailConfig
                          ).map(([key, schema]) =>
                            calculateSection(key, schema)
                          ),
                        },
                      ],
                    }}
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

export default Email;

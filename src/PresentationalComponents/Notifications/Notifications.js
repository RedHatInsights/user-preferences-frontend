{
  /*...(Object.entries(emailConfig)
                          .filter(([key]) => key === state.section)
                          .map(
                            ([key, schema]) =>
                              calculateSection(key, schema)?.fields?.[0]?.fields
                          ) || []), */
}

import React, { useEffect, useReducer, useRef, useState } from 'react';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Split, SplitItem, Text, Title } from '@patternfly/react-core';
import { menuItems } from './data';
import './notifications.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  emailPreferences,
  notificationPreferences,
  register,
} from '../../store';
import { getNotificationSchemas } from '../../actions';
import { getApplicationSchema } from '../../api';
import {
  calculateEmailConfig,
  getSection,
  notificationConfigForBundle,
} from '../../Utilities/functions';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import { FormTemplate } from './FormTemplate';
import FormButtons from '../shared/FormButtons';
import {
  DATA_LIST,
  DESCRIPTIVE_CHECKBOX,
  DataListLayout,
  DescriptiveCheckbox,
  LOADER,
  Loader,
} from '../../SmartComponents/FormComponents';
import useLoaded from '../shared/useLoaded';
import config from '../../config/config.json';

const reducer = (state, action) => {
  switch (action.type) {
    case 'changeTab':
      return {
        ...state,
        bundle: action.payload.bundle,
        section: action.payload.section,
      };
    default:
      throw new Error();
  }
};

const prepareSections = (bundles, searchValue = '') =>
  Object.entries(menuItems).reduce((acc, [bundleKey, value]) => {
    const sections = [
      ...(bundles[bundleKey]?.sections?.filter(
        (section) =>
          section.name
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase()) ||
          section.label
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase())
      ) || []),
    ];
    // Add email?
    return {
      ...acc,
      ...(sections?.length > 0
        ? {
            [bundleKey]: {
              ...value,
              sections,
            },
          }
        : {}),
    };
  }, {});

const Notifications = () => {
  const dispatch = useDispatch();
  const title = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const [emailConfig, setEmailConfig] = useState({});
  const isEmailLoaded = useLoaded(async () => {
    await insights.chrome.auth.getUser();
    register(emailPreferences);
    setEmailConfig(await calculateEmailConfig(config, dispatch));
  });

  const store = useSelector(({ emailPreferences }) => emailPreferences);

  const { bundles } = useSelector(({ notificationPreferences }) => ({
    bundles: Object.entries(menuItems)?.reduce(
      (acc, [key, value]) => ({
        ...acc,
        ...(notificationPreferences?.bundles?.[key]?.sections?.length > 0
          ? { [key]: { ...value, ...notificationPreferences?.bundles?.[key] } }
          : {}),
      }),
      {}
    ),
  }));

  useEffect(() => {
    register(notificationPreferences);
    setLoading(true);
    (async () => {
      await insights.chrome.auth.getUser();
      const promises = Object.keys(menuItems).map((bundleName) =>
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

  return (
    <React.Fragment>
      <Split className="pref-notifications--header">
        <SplitItem className="pf-u-background-color-100" isFilled>
          <div ref={title}>
            <PageHeaderTitle
              className="pref-notifications--title sticky pf-u-pt-lg pf-u-pb-sm pf-u-pl-lg"
              title="My Notifications"
            />
            <Text className="pref-notifications--subtitle pf-u-pb-lg pf-u-pl-lg">
              This service allows you to opt-in and out of receiving
              notifications. Your Organization Administrator has configured
              which notifications you can or can not receive in their{' '}
              <a href={`/settings/notifications`}>Settings</a>.
            </Text>
          </div>
        </SplitItem>
      </Split>
      <FormRenderer
        componentMapper={{
          ...componentMapper,
          [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
          [LOADER]: Loader,
          [DATA_LIST]: DataListLayout,
        }}
        FormTemplate={(props) => (
          <FormTemplate
            {...props}
            schema={bundles}
            title={title.current}
            isLoading={isLoading}
            FormButtons={FormButtons}
          />
        )}
        schema={
          { fields: [] }
          // bundles[state.bundle]?.sections.find(
          //   (section) => section.name === state.section
          // )?.fields[0]
        }
        onSubmit={() => null}
      />
    </React.Fragment>
  );
};
export default Notifications;

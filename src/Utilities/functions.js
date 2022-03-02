import React from 'react';
import { Skeleton } from '@redhat-cloud-services/frontend-components/Skeleton';
import { getEmailSchema } from '../actions';
import { loaderField } from './constants';
import config from '../config/config.json';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

export const getSchema = (app) =>
  !app || !app.loaded ? loaderField : app.schema;

const withNegatedFunction = (booleanFunctions) => {
  return {
    ...booleanFunctions,
    ...Object.fromEntries(
      Object.keys(booleanFunctions).map((methodName) => [
        `!${methodName}`,
        (...args) => !booleanFunctions[methodName](...args),
      ])
    ),
  };
};

export const notificationConfigForBundle = (bundleName) =>
  config['notification-preference']?.[bundleName];

export const useChromePush = () => {
  const push = useChrome(({ chromeHistory: { push } = {} }) => push);
  return (e, link) => {
    if (typeof push === 'function') {
      e.preventDefault();
      push(link.replace(/^.\//, '/'));
    }
  };
};

export const visibilityFunctions = withNegatedFunction({
  ...insights.chrome?.visibilityFunctions,
  hasLoosePermissions: async (permissions = []) => {
    const userPermissions = await insights.chrome.getUserPermissions();
    return permissions.some((item) =>
      userPermissions?.find(({ permission }) => permission === item)
    );
  },
});

export const calculatePermissions = (permissions) =>
  Promise.all(
    [permissions]
      .flat()
      .map(({ method, args }) =>
        visibilityFunctions?.[method]?.(...(args || []))
      )
  ).then((visibility) => visibility.every(Boolean));

export const calculateEmailConfig = (
  { 'email-preference': config } = { 'email-preference': {} },
  dispatch = () => {}
) =>
  Object.entries(config)
    .map(
      ([
        key,
        { permissions, url, apiName, apiVersion, localFile, ...rest },
      ]) => {
        const isVisible = permissions
          ? calculatePermissions(permissions)
          : true;
        (async () => {
          const schemaVisible = await Promise.resolve(isVisible);
          if (schemaVisible) {
            if (localFile) {
              const newMapper = (await import(`../config/${localFile}`))
                .default;
              dispatch(getEmailSchema({ schema: newMapper, application: key }));
            } else {
              dispatch(
                getEmailSchema({ application: key, url, apiName, apiVersion })
              );
            }
          }
        })();

        return {
          [key]: {
            localFile,
            isVisible,
            url,
            apiName,
            apiVersion,
            ...rest,
          },
        };
      }
    )
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

export const getSection = (
  key,
  schema = {},
  storeSchema,
  success = () => {}
) => {
  if (schema.isVisible === true) {
    return {
      label: schema?.title,
      name: key,
      fields: schema?.fields || getSchema(storeSchema),
    };
  } else {
    Promise.resolve(schema.isVisible).then(success);

    return {
      label: <Skeleton />,
      name: key,
      fields: loaderField,
    };
  }
};

export const concatApps = (apps = []) => {
  return `${apps.slice(0, apps.length - (apps.length > 1)).join(', ')}${
    apps.length >= 2 ? ` and ${apps[apps.length - 1]}` : ''
  }`;
};

export const distributeSuccessError = (promisses = []) => {
  return Promise.allSettled(promisses.map(({ promise }) => promise)).then(
    (apps) => {
      return apps.reduce(
        (acc, { value }, index) => ({
          ...acc,
          [value ? 'success' : 'error']: [
            ...acc[value ? 'success' : 'error'],
            promisses[index]?.meta?.title,
          ],
        }),
        { success: [], error: [] }
      );
    }
  );
};

export const dispatchMessages = (
  dispatch = () => undefined,
  success = [],
  error = []
) => {
  if (error.length !== 0 && success.length !== 0) {
    dispatch(
      addNotification({
        dismissable: false,
        variant: 'success',
        title: `Email preferences for ${concatApps(
          success
        )} successfully saved`,
      })
    );

    dispatch(
      addNotification({
        dismissable: false,
        variant: 'danger',
        title: `Email preferences for ${concatApps(
          error
        )} unsuccessfully saved`,
      })
    );
  }

  if (error.length === 0 && success.length !== 0) {
    dispatch(
      addNotification({
        dismissable: false,
        variant: 'success',
        title: 'Preferences successfully saved',
      })
    );
  }

  if (error.length !== 0 && success.length === 0) {
    dispatch(
      addNotification({
        dismissable: false,
        variant: 'danger',
        title: 'Preferences unsuccessfully saved',
      })
    );
  }
};

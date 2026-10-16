import React, { useEffect, useRef, useState } from 'react';
import omit from 'lodash/omit';
import { useFlag } from '@unleash/proxy-client-react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useKesselRbacAccess } from '../../Utilities/kesselRbac';
import { useCustomThreshold } from '../../Utilities/hooks/useCustomThreshold';
import { useIsOrgAdmin } from '../../Utilities/hooks/useIsOrgAdmin';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import { Bullseye, Button, Popover, Spinner } from '@patternfly/react-core';
import {
  SeverityCriticalIcon,
  SeverityImportantIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityNoneIcon,
} from '@patternfly/react-icons';
import PageHeader from '@patternfly/react-component-groups/dist/dynamic/PageHeader';
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
  NOTIFICATION_EVENT_CARD,
  NotificationEventCard,
  TAB_GROUP,
} from '../../SmartComponents/FormComponents';
import { stripSeverityGridUiFromEventTypes } from '../../SmartComponents/FormComponents/severityUtils';
import { PLATFORM_NOTIFICATIONS_SEVERITY_FLAG } from '../../Utilities/featureFlags';
import config from '../../config/config.json';
import FormTabs from './Tabs';
import FormTabGroup from './TabGroup';
import { prepareFields } from './utils';
import FormTemplate from './NotificationTemplate';
import './notifications.scss';
import { useLoadModule, useRemoteHook } from '@scalprum/react-core';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

const SEVERITY_LEARN_MORE_URL =
  'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/configuring_notifications_on_the_red_hat_hybrid_cloud_console/index#con-notif-severity_notif-config-intro';

const messages = defineMessages({
  contactAdminUpdate: {
    id: 'userPrefs.notifications.contactAdminUpdate',
    defaultMessage:
      'Contact my organization administrator to update which notifications I receive',
  },
  contactYourAdmin: {
    id: 'userPrefs.notifications.contactYourAdmin',
    defaultMessage: 'Contact your Organization Administrator',
  },
  severityLabel: {
    id: 'userPrefs.notifications.severityLabel',
    defaultMessage: '{label} severity',
  },
  learnMore: {
    id: 'userPrefs.notifications.learnMore',
    defaultMessage: 'Learn more',
  },
  myNotifications: {
    id: 'userPrefs.notifications.myNotifications',
    defaultMessage: 'My Notifications',
  },
  subtitle: {
    id: 'userPrefs.notifications.subtitle',
    defaultMessage:
      'Opt in or out of receiving notifications, and choose how you want to be notified. Your Organization Administrator has configured which notifications you can or cannot receive on their end. {adminContact} to have these settings updated.',
  },
  severityIntro: {
    id: 'userPrefs.notifications.severityIntro',
    defaultMessage: 'Possible notification severity levels include ',
  },
  savedSuccess: {
    id: 'userPrefs.notifications.savedSuccess',
    defaultMessage: 'Notification preferences successfully saved',
  },
  savedFail: {
    id: 'userPrefs.notifications.savedFail',
    defaultMessage: 'Notification preferences unsuccessfully saved',
  },
  criticalLabel: {
    id: 'userPrefs.severity.critical',
    defaultMessage: 'Critical',
  },
  criticalDescription: {
    id: 'userPrefs.severity.criticalDescription',
    defaultMessage:
      'Urgent notification about an event with impact to your systems',
  },
  importantLabel: {
    id: 'userPrefs.severity.important',
    defaultMessage: 'Important',
  },
  importantDescription: {
    id: 'userPrefs.severity.importantDescription',
    defaultMessage: 'Errors or other events that may impact your systems',
  },
  moderateLabel: {
    id: 'userPrefs.severity.moderate',
    defaultMessage: 'Moderate',
  },
  moderateDescription: {
    id: 'userPrefs.severity.moderateDescription',
    defaultMessage: 'Warning',
  },
  lowLabel: {
    id: 'userPrefs.severity.low',
    defaultMessage: 'Low',
  },
  lowDescription: {
    id: 'userPrefs.severity.lowDescription',
    defaultMessage: 'Information only',
  },
  noneLabel: {
    id: 'userPrefs.severity.none',
    defaultMessage: 'None',
  },
  noneDescription: {
    id: 'userPrefs.severity.noneDescription',
    defaultMessage: 'No security-related impact for this notification',
  },
});

const LIST_SEPARATOR = ', ';
const PERIOD_SPACE = '. ';
const LIST_FINAL_SEPARATOR = ', and ';
const SCALPRUM_MODULE = './ConnectedTimeConfig';
const SCALPRUM_SCOPE = 'notifications';
const NOTIF_TABS_NAME = 'notifTabs';

const severityTerms = [
  {
    label: messages.criticalLabel,
    icon: SeverityCriticalIcon,
    color: 'var(--pf-t--global--icon--color--severity--critical--default)',
    description: messages.criticalDescription,
  },
  {
    label: messages.importantLabel,
    icon: SeverityImportantIcon,
    color: 'var(--pf-t--global--icon--color--severity--important--default)',
    description: messages.importantDescription,
  },
  {
    label: messages.moderateLabel,
    icon: SeverityModerateIcon,
    color: 'var(--pf-t--global--icon--color--severity--moderate--default)',
    description: messages.moderateDescription,
  },
  {
    label: messages.lowLabel,
    icon: SeverityMinorIcon,
    color: 'var(--pf-t--global--icon--color--severity--minor--default)',
    description: messages.lowDescription,
  },
  {
    label: messages.noneLabel,
    icon: SeverityNoneIcon,
    color: 'var(--pf-t--global--icon--color--severity--none--default)',
    description: messages.noneDescription,
  },
];

/* eslint-disable react/prop-types */
const SeverityHelpTerm = ({
  label,
  icon: SeverityIcon,
  color,
  description,
}) => {
  const intl = useIntl();
  return (
    <Popover
      headerContent={
        <span className="pf-v6-u-display-flex pf-v6-u-align-items-center pf-v6-u-flex-nowrap">
          <SeverityIcon
            color={color}
            className="pf-v6-u-display-inline-flex pf-v6-u-flex-shrink-0"
          />
          <span className="pf-v6-u-m-0 pf-v6-u-ml-sm">
            {intl.formatMessage(messages.severityLabel, {
              label: intl.formatMessage(label),
            })}
          </span>
        </span>
      }
      bodyContent={intl.formatMessage(description)}
      footerContent={
        <a
          href={SEVERITY_LEARN_MORE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {intl.formatMessage(messages.learnMore)}
        </a>
      }
    >
      <Button
        variant="link"
        isInline
        className="pref-notifications--severity-term"
        icon={
          <SeverityIcon
            color={color}
            className="pf-v6-u-display-inline-flex pf-v6-u-flex-shrink-0"
          />
        }
      >
        {intl.formatMessage(label)}
      </Button>
    </Popover>
  );
};
/* eslint-enable react/prop-types */

/* eslint-disable react/prop-types */
const NotificationsVAButton = () => {
  const intl = useIntl();
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

  return (
    <Button
      onClick={() => {
        if (!vaLoading && Models) {
          const [, setState] = vaHookResult || [];
          setState({
            isOpen: true,
            currentModel: Models?.VA,
            message: messages.contactAdminUpdate.defaultMessage,
          });
        }
      }}
      variant="link"
      isInline
    >
      {intl.formatMessage(messages.contactYourAdmin)}
    </Button>
  );
};
/* eslint-enable react/prop-types */

const Notifications = () => {
  const intl = useIntl();
  const platformNotificationsSeverity = useFlag(
    PLATFORM_NOTIFICATIONS_SEVERITY_FLAG
  );
  const isVAEnabled = useFlag('platform.va.environment.enabled');
  const isKesselEnabled = useFlag('platform.chrome.kessel');
  const { auth } = useChrome();
  const { permissions: kesselMappedPermissions } = useKesselRbacAccess();
  const { threshold: customThreshold } = useCustomThreshold();
  const { isOrgAdmin } = useIsOrgAdmin();
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
      setEmailConfig(
        calculateEmailConfig(config, dispatch, {
          isKesselEnabled,
          kesselMappedPermissions,
        })
      );
      dispatch(getNotificationsSchema());
    })();
  }, []);

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
                  eventTypes: stripSeverityGridUiFromEventTypes(
                    omit(appData.eventTypes, BULK_SELECT_BUTTON)
                  ),
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
        submitEmail &&
          setEmailConfig(
            calculateEmailConfig(config, dispatch, {
              isKesselEnabled,
              kesselMappedPermissions,
            })
          );
        dispatch(getNotificationsSchema());
        addNotification({
          dismissable: true,
          variant: 'success',
          title: intl.formatMessage(messages.savedSuccess),
        });
      })
      .catch(() => {
        addNotification({
          dismissable: true,
          variant: 'danger',
          title: intl.formatMessage(messages.savedFail),
        });
      });
  };

  return loaded && Object.values(emailPref).every((value) => value.loaded) ? (
    <div id="notifications-container" className="pref-notifications--container">
      <div className="pref-notifications--wrapper">
        <div id="notifications-grid" className="pref-notifications--grid">
          <div ref={titleRef} className="pref-notifications--head">
            <PageHeader
              title={intl.formatMessage(messages.myNotifications)}
              subtitle={
                <>
                  <FormattedMessage
                    {...messages.subtitle}
                    values={{
                      adminContact: isVAEnabled ? (
                        <NotificationsVAButton />
                      ) : (
                        intl.formatMessage(messages.contactYourAdmin)
                      ),
                    }}
                  />
                  <br />
                  {platformNotificationsSeverity && (
                    <>
                      <br />
                      {intl.formatMessage(messages.severityIntro)}
                      {severityTerms.map((term, index) => (
                        <React.Fragment key={term.label.id}>
                          {index > 0 &&
                            index < severityTerms.length - 1 &&
                            LIST_SEPARATOR}
                          {index === severityTerms.length - 1 &&
                            LIST_FINAL_SEPARATOR}
                          <SeverityHelpTerm {...term} />
                        </React.Fragment>
                      ))}
                      {PERIOD_SPACE}
                      <a
                        href={SEVERITY_LEARN_MORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {intl.formatMessage(messages.learnMore)}
                      </a>
                    </>
                  )}
                </>
              }
            >
              <ScalprumComponent
                module={SCALPRUM_MODULE}
                scope={SCALPRUM_SCOPE}
                store={store}
              />
            </PageHeader>
          </div>

          <FormRenderer
            componentMapper={{
              ...componentMapper,
              [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
              [BULK_SELECT_BUTTON]: BulkSelectButton,
              [NOTIFICATION_EVENT_CARD]: NotificationEventCard,
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
                  name: NOTIF_TABS_NAME,
                  titleRef,
                  bundles: notifPref,
                  fields: prepareFields(
                    notifPref,
                    emailPref,
                    emailConfig,
                    platformNotificationsSeverity,
                    customThreshold,
                    isOrgAdmin
                  ),
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

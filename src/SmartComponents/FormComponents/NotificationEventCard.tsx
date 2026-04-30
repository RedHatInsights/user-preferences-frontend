import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  Label,
  Tooltip,
} from '@patternfly/react-core';
import type { LabelProps } from '@patternfly/react-core';
import {
  SeverityCriticalIcon,
  SeverityImportantIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityNoneIcon,
  SeverityUndefinedIcon,
} from '@patternfly/react-icons';
import type { UseFieldApiConfig } from '@data-driven-forms/react-form-renderer';
import type { FormOptions } from '@data-driven-forms/react-form-renderer';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  CLUSTER_MANAGER_MESSAGE,
  isClusterManager,
} from '../../Utilities/clusterManagerConstants';
import './NotificationEventCard.scss';

export interface SubscriptionField {
  name: string;
  label: string;
  initialValue?: boolean;
  disabled?: boolean;
}

export interface NotificationEventCardProps extends UseFieldApiConfig {
  eventName: string;
  eventLabel: string;
  severity?: string;
  subscriptionFields: SubscriptionField[];
  bundle: string;
  app: string;
  afterChange?: (formOptions: FormOptions, checked: boolean) => void;
}

/**
 * Severity label styles matching notifications-frontend event log implementation.
 * Uses PatternFly severity surface tokens with inline CSS custom properties.
 */
const severityLabelFgOnDark = 'var(--pf-t--color--white)';
const severityLabelFgOnLight = 'var(--pf-t--color--black)';

const severityLabelVars = (vars: Record<string, string>): React.CSSProperties =>
  vars as React.CSSProperties;

const eventLogSeverityLabelStyles: Record<string, React.CSSProperties> = {
  CRITICAL: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor':
      'var(--pf-t--global--color--severity--critical--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  IMPORTANT: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor':
      'var(--pf-t--global--color--severity--important--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  MODERATE: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor':
      'var(--pf-t--global--color--severity--moderate--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnLight,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnLight,
  }),
  LOW: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor':
      'var(--pf-t--global--color--severity--minor--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  MINOR: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor':
      'var(--pf-t--global--color--severity--minor--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  NONE: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor':
      'var(--pf-t--global--color--severity--none--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  UNDEFINED: severityLabelVars({
    '--pf-v6-c-label--BorderColor':
      'var(--pf-t--global--color--severity--undefined--200)',
    '--pf-v6-c-label--Color': severityLabelFgOnLight,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnLight,
  }),
};

const toSeverityLabelProps = (
  severity?: string
): Pick<LabelProps, 'icon' | 'style' | 'variant'> => {
  const normalized = severity?.toUpperCase();
  switch (normalized) {
    case 'CRITICAL':
      return {
        style: eventLogSeverityLabelStyles.CRITICAL,
        icon: <SeverityCriticalIcon />,
      };
    case 'IMPORTANT':
      return {
        style: eventLogSeverityLabelStyles.IMPORTANT,
        icon: <SeverityImportantIcon />,
      };
    case 'MODERATE':
      return {
        style: eventLogSeverityLabelStyles.MODERATE,
        icon: <SeverityModerateIcon />,
      };
    case 'LOW':
    case 'MINOR':
      return {
        style: eventLogSeverityLabelStyles.LOW,
        icon: <SeverityMinorIcon />,
      };
    case 'NONE':
      return {
        style: eventLogSeverityLabelStyles.NONE,
        icon: <SeverityNoneIcon />,
      };
    case 'UNDEFINED':
      return {
        style: eventLogSeverityLabelStyles.UNDEFINED,
        variant: 'outline',
        icon: <SeverityUndefinedIcon />,
      };
    case undefined:
    default:
      return {
        style: eventLogSeverityLabelStyles.UNDEFINED,
        variant: 'outline',
        icon: <SeverityUndefinedIcon />,
      };
  }
};

const severityDisplayName: Record<string, string> = {
  CRITICAL: 'Critical',
  IMPORTANT: 'Important',
  MODERATE: 'Moderate',
  LOW: 'Low',
  MINOR: 'Low',
  NONE: 'None',
  UNDEFINED: 'Undefined',
};

const severityDescription: Record<string, string> = {
  CRITICAL: 'Urgent notification about an event with impact to your systems',
  IMPORTANT: 'Errors or other events that may impact your systems',
  MODERATE: 'Warning',
  LOW: 'Information only',
  MINOR: 'Information only',
  NONE: 'Debug or informative updates',
  UNDEFINED: 'Severity level has not been defined for this event',
};

const NotificationEventCard: React.FC<NotificationEventCardProps> = (props) => {
  const {
    eventName,
    eventLabel,
    severity,
    subscriptionFields,
    bundle,
    app,
    afterChange,
    ...fieldProps
  } = props;

  const formOptions = useFormApi();
  const {
    input: { value = {}, onChange, name },
  } = useFieldApi(fieldProps);

  // Check if this is Cluster Manager context where all controls should be disabled
  const isClusterManagerContext = isClusterManager(bundle, app);

  const handleCheckboxChange = (fieldName: string, checked: boolean) => {
    const next = {
      ...value,
      [fieldName]: checked,
    };
    onChange(next);
    afterChange?.(formOptions, checked);
  };

  // Check if any option is selected (handle undefined/null value)
  const hasSelectedOptions =
    value && typeof value === 'object'
      ? Object.values(value).some((v) => Boolean(v))
      : false;

  return (
    <Card isCompact style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
      <CardHeader>
        <CardTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <span
              style={{
                fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
              }}
            >
              {eventLabel}
            </span>
            {severity && hasSelectedOptions && (
              <Tooltip
                content={
                  severityDescription[severity.toUpperCase()] ||
                  severityDescription.UNDEFINED
                }
              >
                <Label {...toSeverityLabelProps(severity)}>
                  {severityDisplayName[severity.toUpperCase()] || severity}
                </Label>
              </Tooltip>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div
          style={{
            display: 'flex',
            gap: 'var(--pf-t--global--spacer--md)',
            flexWrap: 'wrap',
          }}
        >
          {subscriptionFields.map((field) => {
            const checkbox = (
              <Checkbox
                key={field.name}
                id={`${name}-${field.name}`.replace(/[^a-zA-Z0-9-_]/g, '_')}
                label={field.label}
                isChecked={Boolean(value[field.name])}
                isDisabled={isClusterManagerContext || Boolean(field.disabled)}
                onChange={(_e, checked) =>
                  handleCheckboxChange(field.name, checked)
                }
                className={
                  isClusterManagerContext
                    ? 'pref-c-notification-event-card__checkbox--disabled'
                    : undefined
                }
              />
            );

            // Wrap in Tooltip if Cluster Manager context
            return isClusterManagerContext ? (
              <Tooltip key={field.name} content={CLUSTER_MANAGER_MESSAGE}>
                {checkbox}
              </Tooltip>
            ) : (
              checkbox
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default NotificationEventCard;

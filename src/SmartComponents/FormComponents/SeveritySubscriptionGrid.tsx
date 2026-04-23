import React from 'react';
import { Button, Checkbox, Popover } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type {
  FormOptions,
  UseFieldApiConfig,
} from '@data-driven-forms/react-form-renderer';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import SeverityCriticalIcon from '@patternfly/react-icons/dist/js/icons/severity-critical-icon';
import SeverityImportantIcon from '@patternfly/react-icons/dist/js/icons/severity-important-icon';
import SeverityMinorIcon from '@patternfly/react-icons/dist/js/icons/severity-minor-icon';
import SeverityModerateIcon from '@patternfly/react-icons/dist/js/icons/severity-moderate-icon';
import SeverityNoneIcon from '@patternfly/react-icons/dist/js/icons/severity-none-icon';
import SeverityUndefinedIcon from '@patternfly/react-icons/dist/js/icons/severity-undefined-icon';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import { normalizeSeverityKey } from './severityOrder';
import {
  type SeverityGridFormValue,
  type SubscriptionColumn,
  UI_SEVERITY_COLUMNS_KEY,
  applySeverityCascade,
  isSeverityGridValue,
  unionSeverityRowNames,
} from './severitySubscriptionGridUtils';
import './severitySubscriptionGrid.scss';

/** Severity icon colors per PatternFly status/severity pattern. @see https://www.patternfly.org/patterns/status-and-severity/#severity-icons */
const SEVERITY_ICON_COLORS = {
  critical: 'var(--pf-t--global--icon--color--severity--critical--default)',
  important: 'var(--pf-t--global--icon--color--severity--important--default)',
  moderate: 'var(--pf-t--global--icon--color--severity--moderate--default)',
  minor: 'var(--pf-t--global--icon--color--severity--minor--default)',
  none: 'var(--pf-t--global--icon--color--severity--none--default)',
  undefined: 'var(--pf-t--global--icon--color--severity--undefined--default)',
} as const;

const severityIcon = (name: string): React.ReactNode => {
  const key = normalizeSeverityKey(name);
  switch (key) {
    case 'CRITICAL':
      return (
        <SeverityCriticalIcon
          className="pref-severity-pf-icon"
          color={SEVERITY_ICON_COLORS.critical}
        />
      );
    case 'IMPORTANT':
      return (
        <SeverityImportantIcon
          className="pref-severity-pf-icon"
          color={SEVERITY_ICON_COLORS.important}
        />
      );
    case 'MODERATE':
      return (
        <SeverityModerateIcon
          className="pref-severity-pf-icon"
          color={SEVERITY_ICON_COLORS.moderate}
        />
      );
    case 'MINOR':
      return (
        <SeverityMinorIcon
          className="pref-severity-pf-icon"
          color={SEVERITY_ICON_COLORS.minor}
        />
      );
    case 'NONE':
      return (
        <SeverityNoneIcon
          className="pref-severity-pf-icon"
          color={SEVERITY_ICON_COLORS.none}
        />
      );
    case 'UNDEFINED':
    default:
      return (
        <SeverityUndefinedIcon
          className="pref-severity-pf-icon"
          color={SEVERITY_ICON_COLORS.undefined}
        />
      );
  }
};

const humanizeSeverity = (name: string): string =>
  String(name || '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Shared Popover behavior for column header help (Severity + Frequency): click to toggle,
 * same placement/flip/append so both open and dismiss the same way.
 */
const COLUMN_HEADER_HELP_POPOVER_DEFAULTS = {
  position: 'top' as const,
  enableFlip: true,
  triggerAction: 'click' as const,
  hideOnOutsideClick: true,
  distance: 25,
  showClose: true,
  appendTo: () => document.body,
};

const SeverityHeaderHelp = () => (
  <Popover
    {...COLUMN_HEADER_HELP_POPOVER_DEFAULTS}
    headerContent={<div>Severity ratings</div>}
    bodyContent={
      <div>
        Notification severity levels include Critical, Important, Moderate,
        Minor, None, and Undefined.
      </div>
    }
    footerContent={
      <Button
        variant="link"
        isInline
        icon={<ExternalLinkAltIcon />}
        iconPosition="right"
        component="a"
        href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/configuring_notifications_on_the_red_hat_hybrid_cloud_console/index#con-notif-severity_notif-config-intro"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
      </Button>
    }
  >
    <Button
      variant="plain"
      aria-label="Severity ratings help"
      className="pref-severity-help-trigger"
    >
      <OutlinedQuestionCircleIcon />
    </Button>
  </Popover>
);

/** Body copy for the Frequency column help popover (Storybook docs import this string). */
export const FREQUENCY_HELP_POPOVER_BODY =
  'Some services do not offer both instant and daily digest emails. If you select Instant email for any service, you might receive a very large number of emails.';

const FrequencyHeaderHelp = () => (
  <Popover
    {...COLUMN_HEADER_HELP_POPOVER_DEFAULTS}
    headerContent={<div>Important</div>}
    bodyContent={<div>{FREQUENCY_HELP_POPOVER_BODY}</div>}
    footerContent={
      <Button
        variant="link"
        isInline
        icon={<ExternalLinkAltIcon />}
        iconPosition="right"
        component="a"
        href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/configuring_notifications_on_the_red_hat_hybrid_cloud_console/index#proc-notif-config-user-preferences_notifications"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
      </Button>
    }
  >
    <Button
      variant="plain"
      aria-label="Frequency options help"
      className="pref-severity-help-trigger"
    >
      <ExclamationTriangleIcon />
    </Button>
  </Popover>
);

export type SeveritySubscriptionGridProps = UseFieldApiConfig & {
  subscriptionColumns?: SubscriptionColumn[];
  afterChange?: (_formOptions: FormOptions, _checked: boolean) => void;
};

const SeveritySubscriptionGrid: React.FC<SeveritySubscriptionGridProps> = (
  props
) => {
  const { subscriptionColumns = [], afterChange, ...fieldProps } = props;
  const formOptions = useFormApi();
  const {
    input: { value, onChange, name },
  } = useFieldApi(fieldProps);

  const gridValue = isSeverityGridValue(value) ? value : null;

  const columns: SubscriptionColumn[] =
    gridValue?.[UI_SEVERITY_COLUMNS_KEY] ??
    subscriptionColumns.map((c) => ({
      ...c,
      severities: (c.severities || []).map((s) => ({ ...s })),
    }));
  const rowNames = unionSeverityRowNames(columns);

  const isChecked = (subKey: string, severityName: string): boolean =>
    Boolean(gridValue?.subscriptionTypes?.[subKey]?.[severityName]);

  const isDisabled = (subKey: string, severityName: string): boolean => {
    const col = columns.find((c) => c.key === subKey);
    const sev = col?.severities?.find((s) => s.name === severityName);
    if (!sev) {
      return true;
    }
    return Boolean(sev.disabled);
  };

  const handleCellChange = (
    subKey: string,
    severityName: string,
    checked: boolean
  ) => {
    const base: SeverityGridFormValue =
      gridValue ??
      ({
        subscriptionTypes: {},
        [UI_SEVERITY_COLUMNS_KEY]: columns,
      } as SeverityGridFormValue);
    const next = applySeverityCascade(base, subKey, severityName, checked);
    onChange(next);
    afterChange?.(formOptions, checked);
  };

  return (
    <div
      className="pref-severity-subscription-grid"
      data-testid="severity-subscription-grid"
    >
      <Table
        borders
        variant="compact"
        aria-label="Notification severity and frequency"
      >
        <Thead>
          <Tr>
            <Th scope="col">
              <span className="pref-severity-th-label">Severity</span>
              <SeverityHeaderHelp />
            </Th>
            <Th scope="col">
              <span className="pref-severity-th-label">Frequency</span>
              <FrequencyHeaderHelp />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rowNames.map((severityName) => (
            <Tr key={severityName}>
              <Th scope="row" dataLabel="Severity">
                <span className="pref-severity-row">
                  {severityIcon(severityName)}
                  <span className="pref-severity-row-label">
                    {humanizeSeverity(severityName)}
                  </span>
                </span>
              </Th>
              <Td dataLabel="Frequency">
                <div className="pref-severity-frequency-cells">
                  {columns.map((col) => (
                    <Checkbox
                      key={`${col.key}-${severityName}`}
                      id={`sev-${name}-${col.key}-${severityName}`.replace(
                        /[^a-zA-Z0-9-_]/g,
                        '_'
                      )}
                      label={col.label}
                      isChecked={isChecked(col.key, severityName)}
                      isDisabled={isDisabled(col.key, severityName)}
                      onChange={(_e, checked) =>
                        handleCellChange(col.key, severityName, checked)
                      }
                    />
                  ))}
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default SeveritySubscriptionGrid;

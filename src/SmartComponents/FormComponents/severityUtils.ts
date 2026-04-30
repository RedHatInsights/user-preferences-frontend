import { normalizeSeverityKey, sortSeverityNames } from './severityOrder';

export const UI_SEVERITY_COLUMNS_KEY = '_uiSeverityColumns';

export interface SeverityCell {
  name: string;
  initialValue?: boolean;
  disabled?: boolean;
}

export interface SubscriptionColumn {
  key: string;
  label?: string;
  severities: SeverityCell[];
}

/** Form + POST payload shape for one event type (UI meta stripped before save). */
export interface SeverityGridFormValue {
  subscriptionTypes: Record<string, Record<string, boolean>>;
  _uiSeverityColumns: SubscriptionColumn[];
}

export type EventTypeFormValue =
  | boolean
  | SeverityGridFormValue
  | Record<string, unknown>;

export function isSeverityGridValue(
  value: unknown
): value is SeverityGridFormValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'subscriptionTypes' in value &&
    typeof (value as SeverityGridFormValue).subscriptionTypes === 'object' &&
    (value as SeverityGridFormValue).subscriptionTypes !== null &&
    UI_SEVERITY_COLUMNS_KEY in value &&
    Array.isArray((value as SeverityGridFormValue)[UI_SEVERITY_COLUMNS_KEY])
  );
}

/**
 * True when every non-disabled severity × subscription cell is true.
 */
export const isSeverityGridFullyEnabled = (
  value: SeverityGridFormValue | null | undefined
): boolean => {
  if (!value?.subscriptionTypes || !value[UI_SEVERITY_COLUMNS_KEY]) {
    return false;
  }
  for (const col of value[UI_SEVERITY_COLUMNS_KEY]) {
    const map = value.subscriptionTypes[col.key] || {};
    for (const sev of col.severities || []) {
      if (sev.disabled) {
        continue;
      }
      if (!map[sev.name]) {
        return false;
      }
    }
  }
  return true;
};

export const buildInitialSeverityGridValue = (
  columns: SubscriptionColumn[]
): SeverityGridFormValue => {
  const subscriptionTypes: Record<string, Record<string, boolean>> = {};
  const uiColumns = columns.map((c) => ({
    ...c,
    severities: (c.severities || []).map((s) => ({ ...s })),
  }));
  for (const col of uiColumns) {
    subscriptionTypes[col.key] = {};
    for (const sev of col.severities || []) {
      subscriptionTypes[col.key][sev.name] = Boolean(sev.initialValue);
    }
  }
  return {
    subscriptionTypes,
    [UI_SEVERITY_COLUMNS_KEY]: uiColumns,
  } as SeverityGridFormValue;
};

export const applySeverityCascade = (
  value: SeverityGridFormValue,
  subKey: string,
  severityName: string,
  checked: boolean
): SeverityGridFormValue => {
  const columns = value[UI_SEVERITY_COLUMNS_KEY];
  if (!columns) {
    return value;
  }
  const next: SeverityGridFormValue = {
    subscriptionTypes: { ...value.subscriptionTypes },
    [UI_SEVERITY_COLUMNS_KEY]: value[UI_SEVERITY_COLUMNS_KEY],
  };
  for (const k of Object.keys(next.subscriptionTypes)) {
    next.subscriptionTypes[k] = { ...next.subscriptionTypes[k] };
  }
  const col = columns.find((c) => c.key === subKey);
  if (!col) {
    return value;
  }
  const sevMeta = col.severities.find((s) => s.name === severityName);
  if (!sevMeta || sevMeta.disabled) {
    return value;
  }
  next.subscriptionTypes[subKey][severityName] = checked;
  return next;
};

export const buildBulkSeverityGridValue = (
  prevValue: boolean | SeverityGridFormValue,
  allOn: boolean
): boolean | SeverityGridFormValue => {
  if (typeof prevValue === 'boolean') {
    return allOn;
  }
  if (!prevValue?.subscriptionTypes || !prevValue[UI_SEVERITY_COLUMNS_KEY]) {
    return prevValue;
  }
  const next: SeverityGridFormValue = {
    subscriptionTypes: {},
    [UI_SEVERITY_COLUMNS_KEY]: prevValue[UI_SEVERITY_COLUMNS_KEY],
  };
  for (const col of prevValue[UI_SEVERITY_COLUMNS_KEY]) {
    next.subscriptionTypes[col.key] = {};
    for (const sev of col.severities || []) {
      const prev =
        prevValue.subscriptionTypes[col.key]?.[sev.name] ??
        Boolean(sev.initialValue);
      next.subscriptionTypes[col.key][sev.name] = sev.disabled ? prev : allOn;
    }
  }
  return next;
};

/**
 * Build a severity grid value with only CRITICAL severity enabled across all columns.
 * Respects disabled cells (preserves their state).
 * Used for "Select critical only" bulk action.
 */
export const buildCriticalOnlySeverityGridValue = (
  prevValue: boolean | SeverityGridFormValue,
  columns: SubscriptionColumn[]
): boolean | SeverityGridFormValue => {
  if (typeof prevValue === 'boolean') {
    // For boolean event types, this operation doesn't apply
    return prevValue;
  }

  let gridValue: SeverityGridFormValue;

  if (!prevValue?.subscriptionTypes || !prevValue[UI_SEVERITY_COLUMNS_KEY]) {
    // Initialize from columns if no previous value
    gridValue = buildInitialSeverityGridValue(columns);
  } else {
    gridValue = prevValue;
  }

  const next: SeverityGridFormValue = {
    subscriptionTypes: {},
    [UI_SEVERITY_COLUMNS_KEY]: gridValue[UI_SEVERITY_COLUMNS_KEY],
  };

  for (const col of gridValue[UI_SEVERITY_COLUMNS_KEY]) {
    next.subscriptionTypes[col.key] = {};
    for (const sev of col.severities || []) {
      const isCritical = normalizeSeverityKey(sev.name) === 'CRITICAL';
      const prev =
        gridValue.subscriptionTypes[col.key]?.[sev.name] ??
        Boolean(sev.initialValue);

      // Enable if CRITICAL and not disabled, otherwise keep previous if disabled, else false
      next.subscriptionTypes[col.key][sev.name] = sev.disabled
        ? prev
        : isCritical;
    }
  }

  return next;
};

/** Whether a single eventTypes entry counts as "fully on" for bulk / afterChange. */
export const isEventTypePreferenceOn = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (isSeverityGridValue(value)) {
    return isSeverityGridFullyEnabled(value);
  }
  // Handle simple object structure {INSTANT: bool, DAILY: bool}
  if (value && typeof value === 'object') {
    return Object.values(value).some((v) => Boolean(v));
  }
  return Boolean(value);
};

export const isInitialSeverityGridFullyEnabled = (
  columns: SubscriptionColumn[]
): boolean =>
  isSeverityGridFullyEnabled(buildInitialSeverityGridValue(columns));

export interface NotificationEventTypeField {
  name?: string;
  label?: string;
  title?: string;
  severities?: SeverityCell[];
  [key: string]: unknown;
}

export interface NotificationEventType {
  name: string;
  label?: string;
  fields?: NotificationEventTypeField[];
  [key: string]: unknown;
}

/**
 * GET shape: each event `fields[]` entry is a subscription type with `severities[]`.
 */
export const eventTypeUsesSeverityGrid = (
  eventType: NotificationEventType | null | undefined
): boolean => {
  const fields = eventType?.fields;
  if (!Array.isArray(fields) || fields.length === 0) {
    return false;
  }
  return fields.every(
    (f) =>
      Array.isArray(f.severities) && f.severities.length > 0 && Boolean(f.name)
  );
};

export const unionSeverityRowNames = (
  columns: SubscriptionColumn[]
): string[] => {
  const names = columns.flatMap((c) => (c.severities || []).map((s) => s.name));
  return sortSeverityNames(names);
};

export type StrippedEventPreference =
  | boolean
  | { subscriptionTypes: Record<string, Record<string, boolean>> }
  | { emailSubscriptionTypes: Record<string, boolean> };

/** Remove UI-only keys from event type values before POST. */
export const stripSeverityGridUiFromEventTypes = (
  eventTypes: Record<string, EventTypeFormValue> | null | undefined
): Record<string, StrippedEventPreference> => {
  const out: Record<string, StrippedEventPreference> = {};
  for (const [k, v] of Object.entries(eventTypes || {})) {
    if (isSeverityGridValue(v)) {
      out[k] = {
        subscriptionTypes: Object.fromEntries(
          Object.entries(v.subscriptionTypes).map(([sk, smap]) => [
            sk,
            typeof smap === 'object' && smap !== null
              ? { ...smap }
              : (smap as Record<string, boolean>),
          ])
        ),
      };
      continue;
    }
    // Handle simple object structure {INSTANT: bool, DAILY: bool} from NotificationEventCard
    // Wrap in emailSubscriptionTypes for backend
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      out[k] = { emailSubscriptionTypes: v as Record<string, boolean> };
      continue;
    }
    out[k] = v as StrippedEventPreference;
  }
  return out;
};

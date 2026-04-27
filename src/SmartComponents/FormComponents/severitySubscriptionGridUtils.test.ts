import {
  type SeverityGridFormValue,
  type SubscriptionColumn,
  UI_SEVERITY_COLUMNS_KEY,
  applySeverityCascade,
  buildBulkSeverityGridValue,
  buildInitialSeverityGridValue,
  eventTypeUsesSeverityGrid,
  isInitialSeverityGridFullyEnabled,
  isSeverityGridFullyEnabled,
  stripSeverityGridUiFromEventTypes,
} from './severitySubscriptionGridUtils';
import { normalizeSeverityKey, severityRank } from './severityOrder';

const sampleColumns = (): SubscriptionColumn[] => [
  {
    key: 'INSTANT',
    label: 'Instant email',
    severities: [
      { name: 'CRITICAL', initialValue: false, disabled: false },
      { name: 'IMPORTANT', initialValue: false, disabled: false },
      { name: 'MODERATE', initialValue: false, disabled: false },
    ],
  },
  {
    key: 'DAILY',
    label: 'Daily digest email',
    severities: [
      { name: 'CRITICAL', initialValue: false, disabled: true },
      { name: 'IMPORTANT', initialValue: false, disabled: false },
      { name: 'MODERATE', initialValue: false, disabled: false },
    ],
  },
];

describe('eventTypeUsesSeverityGrid', () => {
  it('returns false without severities', () => {
    expect(
      eventTypeUsesSeverityGrid({
        name: 'X',
        fields: [{ name: 'INSTANT', label: 'I', component: 'x' }],
      })
    ).toBe(false);
  });

  it('returns true when every field has severities and name', () => {
    expect(
      eventTypeUsesSeverityGrid({
        name: 'POLICY',
        label: 'Policy',
        fields: [
          {
            name: 'INSTANT',
            label: 'Instant',
            severities: [{ name: 'CRITICAL', initialValue: false }],
          },
          {
            name: 'DAILY',
            label: 'Daily',
            severities: [{ name: 'CRITICAL', initialValue: false }],
          },
        ],
      })
    ).toBe(true);
  });
});

describe('LOW severity alias (backend) vs MINOR (PatternFly)', () => {
  it('normalizes LOW to MINOR for rank/icon logic', () => {
    expect(normalizeSeverityKey('low')).toBe('MINOR');
    expect(normalizeSeverityKey('LOW')).toBe('MINOR');
    expect(severityRank('LOW')).toBe(severityRank('MINOR'));
  });

  it('cascades when enabling a LOW row like MINOR', () => {
    const columns: SubscriptionColumn[] = [
      {
        key: 'INSTANT',
        label: 'Instant email',
        severities: [
          { name: 'CRITICAL', initialValue: false, disabled: false },
          { name: 'IMPORTANT', initialValue: false, disabled: false },
          { name: 'LOW', initialValue: false, disabled: false },
        ],
      },
    ];
    const base = buildInitialSeverityGridValue(columns);
    const next = applySeverityCascade(base, 'INSTANT', 'LOW', true);
    expect(next.subscriptionTypes.INSTANT.CRITICAL).toBe(true);
    expect(next.subscriptionTypes.INSTANT.IMPORTANT).toBe(true);
    expect(next.subscriptionTypes.INSTANT.LOW).toBe(true);
  });
});

describe('applySeverityCascade', () => {
  it('enables more critical severities when turning on a lower severity', () => {
    const base = buildInitialSeverityGridValue(sampleColumns());
    const next = applySeverityCascade(base, 'INSTANT', 'MODERATE', true);
    expect(next.subscriptionTypes.INSTANT.CRITICAL).toBe(true);
    expect(next.subscriptionTypes.INSTANT.IMPORTANT).toBe(true);
    expect(next.subscriptionTypes.INSTANT.MODERATE).toBe(true);
    expect(next.subscriptionTypes.DAILY.CRITICAL).toBe(false);
  });

  it('does not enable disabled severities', () => {
    const base = buildInitialSeverityGridValue(sampleColumns());
    const next = applySeverityCascade(base, 'DAILY', 'MODERATE', true);
    expect(next.subscriptionTypes.DAILY.CRITICAL).toBe(false);
    expect(next.subscriptionTypes.DAILY.IMPORTANT).toBe(true);
    expect(next.subscriptionTypes.DAILY.MODERATE).toBe(true);
  });
});

describe('buildBulkSeverityGridValue', () => {
  it('sets all non-disabled cells to the bulk value', () => {
    const base = buildInitialSeverityGridValue(sampleColumns());
    const on = buildBulkSeverityGridValue(base, true) as SeverityGridFormValue;
    expect(isSeverityGridFullyEnabled(on)).toBe(true);
    const off = buildBulkSeverityGridValue(on, false) as SeverityGridFormValue;
    expect(off.subscriptionTypes.INSTANT.CRITICAL).toBe(false);
    expect(off.subscriptionTypes.DAILY.CRITICAL).toBe(false);
  });
});

describe('isInitialSeverityGridFullyEnabled', () => {
  it('is false when any selectable cell starts off', () => {
    expect(isInitialSeverityGridFullyEnabled(sampleColumns())).toBe(false);
  });
});

describe('stripSeverityGridUiFromEventTypes', () => {
  it('drops UI meta and keeps subscriptionTypes', () => {
    const v = buildInitialSeverityGridValue(sampleColumns());
    expect(v[UI_SEVERITY_COLUMNS_KEY]).toBeDefined();
    const stripped = stripSeverityGridUiFromEventTypes({ evt: v });
    expect(
      (stripped.evt as Record<string, unknown>)[UI_SEVERITY_COLUMNS_KEY]
    ).toBeUndefined();
    expect(
      (stripped.evt as { subscriptionTypes: unknown }).subscriptionTypes
    ).toBeDefined();
  });
});

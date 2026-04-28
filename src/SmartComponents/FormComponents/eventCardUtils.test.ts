import {
  type SeverityGridFormValue,
  type SubscriptionColumn,
  buildInitialSeverityGridValue,
} from './severityUtils';
import { type EventCounts, calculateEventCounts } from './eventCardUtils';

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

describe('calculateEventCounts', () => {
  describe('for severity grid event types', () => {
    it('counts total non-disabled cells', () => {
      const value = buildInitialSeverityGridValue(sampleColumns());
      const counts = calculateEventCounts(sampleColumns(), value);

      // INSTANT: 3 cells, DAILY: 2 cells (CRITICAL disabled) = 5 total
      expect(counts.totalCount).toBe(5);
    });

    it('counts CRITICAL severity cells', () => {
      const value = buildInitialSeverityGridValue(sampleColumns());
      const counts = calculateEventCounts(sampleColumns(), value);

      // Only INSTANT.CRITICAL (DAILY.CRITICAL is disabled)
      expect(counts.criticalCount).toBe(1);
    });

    it('counts selected cells', () => {
      const value = buildInitialSeverityGridValue(sampleColumns());
      // Enable some cells
      value.subscriptionTypes.INSTANT.CRITICAL = true;
      value.subscriptionTypes.INSTANT.IMPORTANT = true;
      value.subscriptionTypes.DAILY.MODERATE = true;

      const counts = calculateEventCounts(sampleColumns(), value);
      expect(counts.selectedCount).toBe(3);
    });

    it('excludes disabled cells from all counts except total', () => {
      const value = buildInitialSeverityGridValue(sampleColumns());
      // Try to enable disabled cell (should not count)
      value.subscriptionTypes.DAILY.CRITICAL = true;

      const counts = calculateEventCounts(sampleColumns(), value);

      // Disabled cells don't count toward criticalCount or selectedCount
      expect(counts.totalCount).toBe(5); // Still excludes disabled
      expect(counts.criticalCount).toBe(1); // Only INSTANT.CRITICAL
      expect(counts.selectedCount).toBe(0); // DAILY.CRITICAL is disabled, doesn't count
    });

    it('handles all cells selected', () => {
      const value = buildInitialSeverityGridValue(sampleColumns());
      // Enable all non-disabled cells
      value.subscriptionTypes.INSTANT.CRITICAL = true;
      value.subscriptionTypes.INSTANT.IMPORTANT = true;
      value.subscriptionTypes.INSTANT.MODERATE = true;
      value.subscriptionTypes.DAILY.IMPORTANT = true;
      value.subscriptionTypes.DAILY.MODERATE = true;

      const counts = calculateEventCounts(sampleColumns(), value);
      expect(counts.selectedCount).toBe(5);
      expect(counts.totalCount).toBe(5);
    });

    it('handles no cells selected', () => {
      const value = buildInitialSeverityGridValue(sampleColumns());
      const counts = calculateEventCounts(sampleColumns(), value);

      expect(counts.selectedCount).toBe(0);
      expect(counts.totalCount).toBe(5);
    });
  });

  describe('for boolean event types', () => {
    it('returns column count when value is true', () => {
      const counts = calculateEventCounts(sampleColumns(), true);

      expect(counts.totalCount).toBe(2); // 2 columns (INSTANT, DAILY)
      expect(counts.criticalCount).toBe(0); // Not applicable for boolean
      expect(counts.selectedCount).toBe(2); // All selected when true
    });

    it('returns zero selectedCount when value is false', () => {
      const counts = calculateEventCounts(sampleColumns(), false);

      expect(counts.totalCount).toBe(2);
      expect(counts.criticalCount).toBe(0);
      expect(counts.selectedCount).toBe(0);
    });

    it('handles undefined value', () => {
      const counts = calculateEventCounts(sampleColumns(), undefined);

      expect(counts.totalCount).toBe(2);
      expect(counts.criticalCount).toBe(0);
      expect(counts.selectedCount).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('handles empty columns array', () => {
      const value = buildInitialSeverityGridValue([]);
      const counts = calculateEventCounts([], value);

      expect(counts.totalCount).toBe(0);
      expect(counts.criticalCount).toBe(0);
      expect(counts.selectedCount).toBe(0);
    });

    it('handles columns with no severities', () => {
      const emptyColumns: SubscriptionColumn[] = [
        { key: 'INSTANT', label: 'Instant', severities: [] },
      ];
      const value = buildInitialSeverityGridValue(emptyColumns);
      const counts = calculateEventCounts(emptyColumns, value);

      expect(counts.totalCount).toBe(0);
      expect(counts.criticalCount).toBe(0);
      expect(counts.selectedCount).toBe(0);
    });
  });
});

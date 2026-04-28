import { normalizeSeverityKey } from './severityOrder';
import {
  type SeverityGridFormValue,
  type SubscriptionColumn,
  isSeverityGridValue,
} from './severityUtils';

export interface EventCounts {
  totalCount: number; // Total non-disabled cells
  criticalCount: number; // Total CRITICAL severity cells across all columns
  selectedCount: number; // Currently selected cells
}

/**
 * Calculate counts for event card kebab menu items.
 * Handles both boolean and severity grid event types.
 */
export const calculateEventCounts = (
  columns: SubscriptionColumn[],
  value: boolean | SeverityGridFormValue | undefined
): EventCounts => {
  // For boolean event types
  if (typeof value === 'boolean' || !isSeverityGridValue(value)) {
    // Boolean events don't have severity grid
    // Return simple counts based on subscription columns
    const totalCount = columns.length;
    return {
      totalCount,
      criticalCount: 0, // Not applicable for boolean
      selectedCount: value ? totalCount : 0,
    };
  }

  // For severity grid event types
  let totalCount = 0;
  let criticalCount = 0;
  let selectedCount = 0;

  for (const col of columns) {
    for (const sev of col.severities || []) {
      if (sev.disabled) {
        continue;
      }

      totalCount++;

      if (normalizeSeverityKey(sev.name) === 'CRITICAL') {
        criticalCount++;
      }

      if (value.subscriptionTypes?.[col.key]?.[sev.name]) {
        selectedCount++;
      }
    }
  }

  return { totalCount, criticalCount, selectedCount };
};

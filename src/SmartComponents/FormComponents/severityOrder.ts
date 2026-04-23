/**
 * Canonical severity ordering (most critical first) for cascade and row order.
 * Matches backend enum names case-insensitively via normalizeSeverityKey.
 */
export const SEVERITY_ORDER = [
  'CRITICAL',
  'IMPORTANT',
  'MODERATE',
  'MINOR',
  'NONE',
  'UNDEFINED',
] as const;

export const normalizeSeverityKey = (name: string | undefined | null): string =>
  String(name ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');

export const severityRank = (name: string | undefined | null): number => {
  const key = normalizeSeverityKey(name);
  const idx = (SEVERITY_ORDER as readonly string[]).indexOf(key);
  return idx === -1 ? SEVERITY_ORDER.length + 1 : idx;
};

/** Sort severity names: known order first, then alphabetical. */
export const sortSeverityNames = (names: string[]): string[] =>
  [...new Set(names)].sort((a, b) => {
    const d = severityRank(a) - severityRank(b);
    if (d !== 0) {
      return d;
    }
    return String(a).localeCompare(String(b));
  });

/** Severities more critical than `severityName` (appear earlier in SEVERITY_ORDER). */
export const moreCriticalSeverityNames = (
  severityName: string,
  allNames: string[]
): string[] => {
  const rank = severityRank(severityName);
  return allNames.filter((n) => severityRank(n) < rank);
};

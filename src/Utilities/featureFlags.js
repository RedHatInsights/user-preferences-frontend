/**
 * Unleash feature flags (Hybrid Cloud Console / platform naming).
 * @see https://docs.getunleash.io/reference/feature-toggle-types
 *
 * When **platform.notifications.severity** is enabled, notification event types
 * that expose a severity grid use the severity subscription table UI; the same
 * flag controls severity help in the page subtitle. When it is off, the legacy
 * checkbox layout is used; the notifications API should not ship grid-only event
 * payloads unless this flag is on (or the UI cannot render those event types).
 */
export const PLATFORM_NOTIFICATIONS_SEVERITY_FLAG =
  'platform.notifications.severity';

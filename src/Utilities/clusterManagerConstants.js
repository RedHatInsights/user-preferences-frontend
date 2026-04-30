/**
 * Constants and utilities for Cluster Manager special case handling
 * in notification preferences.
 *
 * For Cluster Manager | OpenShift, all notification preference controls
 * are disabled because preferences are managed per-cluster in the
 * Cluster Manager service.
 */

export const CLUSTER_MANAGER_BUNDLE = 'openshift';
export const CLUSTER_MANAGER_APP = 'cluster-manager';

export const CLUSTER_MANAGER_MESSAGE =
  'Preferences for OpenShift notifications are currently being managed for individual clusters in the Cluster Manager service.';

export const CLUSTER_MANAGER_URL = '/openshift/clusters/list';

/**
 * Check if current context is Cluster Manager
 * @param {string} bundle - Bundle identifier
 * @param {string} app - Application identifier
 * @returns {boolean} True if this is the Cluster Manager context
 */
export const isClusterManager = (bundle, app) =>
  bundle === CLUSTER_MANAGER_BUNDLE && app === CLUSTER_MANAGER_APP;

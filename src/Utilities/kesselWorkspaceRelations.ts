/**
 * Kessel workspace relations for RBAC v2.
 *
 * Maps v1 wildcard permissions to v2 Kessel relations.
 * Based on rbac-config schemas: advisor is migrated, insights is not.
 *
 * The @add_v1_based_permission annotation in advisor.ksl creates these relations:
 * - ${app}_${resource}_${verb} (specific permission)
 * - ${app}_${resource}_all (all verbs for resource)
 * - ${app}_all_${verb} (all resources for verb)
 * - ${app}_all_all (all permissions for app)
 */

/**
 * Map v1 permission format to v2 Kessel relation name.
 *
 * Examples:
 * - advisor:*:* → advisor_all_all
 * - advisor:*:read → advisor_all_read
 * - advisor:rules:read → advisor_rules_read
 * - insights:*:* → null (insights not migrated to v2, assume granted)
 *
 * @param v1Permission - v1 format permission (app:resource:verb)
 * @returns Kessel relation name or null if app not migrated
 */
export const mapV1PermissionToKesselRelation = (
  v1Permission: string
): string | null => {
  // Handle exact matches for known permissions
  const exactMatches: Record<string, string> = {
    // Advisor wildcard permissions
    'advisor:*:*': 'advisor_all_all',
    'advisor:*:read': 'advisor_all_read',
    'advisor:*:write': 'advisor_all_write',

    // Advisor specific permissions from advisor.ksl
    'advisor:rules:read': 'advisor_rules_read',
    'advisor:disable_recommendations:read': 'advisor_disable_recommendations_view',
    'advisor:disable_recommendations:write': 'advisor_disable_recommendations_edit',
    'advisor:weekly_email:read': 'advisor_weekly_email_view',
    'advisor:weekly_report:read': 'advisor_weekly_report_view',
    'advisor:weekly_report_auto_subscribe:read':
      'advisor_weekly_report_auto_subscribe_view',
    'advisor:weekly_report_auto_subscribe:write':
      'advisor_weekly_report_auto_subscribe_edit',
    'advisor:recommendation_results:read': 'advisor_recommendation_results_view',
    'advisor:recommendation_results:write': 'advisor_recommendation_results_edit',
    'advisor:exports:read': 'advisor_exports_view',
  };

  if (exactMatches[v1Permission]) {
    return exactMatches[v1Permission];
  }

  // Parse v1 permission format: app:resource:verb
  const parts = v1Permission.split(':');
  if (parts.length !== 3) {
    return null;
  }

  const [app, resource, verb] = parts;

  // Insights is not migrated to v2 - return special marker 'UNMIGRATED'
  if (app === 'insights') {
    return 'UNMIGRATED';
  }

  // Generate relation name for advisor following the pattern
  if (app === 'advisor') {
    // Convert verb: read→read, write→write, *→all
    const kesselVerb = verb === '*' ? 'all' : verb;
    // Convert resource: *→all, kebab-case→snake_case otherwise
    const kesselResource = resource === '*' ? 'all' : resource.replace(/-/g, '_');

    return `${app}_${kesselResource}_${kesselVerb}`;
  }

  return null;
};

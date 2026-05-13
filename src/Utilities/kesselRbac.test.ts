import { mapV1PermissionToKesselRelation } from './kesselWorkspaceRelations';

describe('kesselRbac', () => {
  describe('mapV1PermissionToKesselRelation', () => {
    it('maps advisor wildcard permissions to v2 relations', () => {
      expect(mapV1PermissionToKesselRelation('advisor:*:*')).toBe('advisor_all_all');
      expect(mapV1PermissionToKesselRelation('advisor:*:read')).toBe('advisor_all_read');
      expect(mapV1PermissionToKesselRelation('advisor:*:write')).toBe('advisor_all_write');
    });

    it('maps advisor specific permissions to v2 relations', () => {
      expect(mapV1PermissionToKesselRelation('advisor:rules:read')).toBe('advisor_rules_read');
      expect(mapV1PermissionToKesselRelation('advisor:disable_recommendations:read')).toBe(
        'advisor_disable_recommendations_view'
      );
      expect(mapV1PermissionToKesselRelation('advisor:weekly_email:read')).toBe(
        'advisor_weekly_email_view'
      );
    });

    it('returns UNMIGRATED for insights permissions (not migrated)', () => {
      expect(mapV1PermissionToKesselRelation('insights:*:*')).toBe('UNMIGRATED');
      expect(mapV1PermissionToKesselRelation('insights:*:read')).toBe('UNMIGRATED');
      expect(mapV1PermissionToKesselRelation('insights:some:read')).toBe('UNMIGRATED');
    });

    it('returns null for invalid permission format', () => {
      expect(mapV1PermissionToKesselRelation('invalid')).toBe(null);
      expect(mapV1PermissionToKesselRelation('invalid:permission')).toBe(null);
      expect(mapV1PermissionToKesselRelation('')).toBe(null);
    });

    it('generates relation names for unmapped advisor permissions', () => {
      // Should follow the pattern: app_resource_verb
      expect(mapV1PermissionToKesselRelation('advisor:custom-resource:read')).toBe(
        'advisor_custom_resource_read'
      );
      expect(mapV1PermissionToKesselRelation('advisor:another:write')).toBe(
        'advisor_another_write'
      );
    });
  });
});

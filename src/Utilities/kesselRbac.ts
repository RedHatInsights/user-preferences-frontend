import React, { useEffect, useMemo, createContext, useContext } from 'react';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { useDefaultWorkspace } from './hooks/useDefaultWorkspace';

/**
 * Permission format returned by RBAC v1 API
 */
export interface V1Permission {
  permission: string;
  resourceDefinitions?: Array<{
    attributeFilter: {
      key: string;
      operation: string;
      value: string;
    };
  }>;
}

/**
 * Kessel permission check result
 */
export interface KesselPermissionResult {
  relation: string;
  allowed: boolean;
}

/**
 * Context for Kessel v2 RBAC access checks.
 * Provides workspace ID and permission check results.
 */
export interface KesselRbacAccessContextValue {
  /**
   * Default workspace ID from /api/rbac/v2/workspaces/?type=default
   */
  workspaceId: string | undefined;

  /**
   * Whether the workspace and permissions are still loading
   */
  isLoading: boolean;

  /**
   * Permission check results mapped to v1 format
   */
  permissions: V1Permission[];

  /**
   * Raw Kessel permission check results
   */
  kesselPermissions: KesselPermissionResult[];

  /**
   * Errors encountered during workspace or permission fetching
   */
  errors: Error[];
}

export const KesselRbacAccessContext = createContext<KesselRbacAccessContextValue | undefined>(
  undefined
);

/**
 * Hook to access Kessel RBAC context.
 * @throws if used outside KesselRbacAccessProvider
 */
export const useKesselRbacAccess = (): KesselRbacAccessContextValue => {
  const context = useContext(KesselRbacAccessContext);
  if (!context) {
    throw new Error('useKesselRbacAccess must be used within KesselRbacAccessProvider');
  }
  return context;
};

/**
 * Provider for Kessel v2 RBAC.
 *
 * Fetches the default workspace and checks permissions for all required relations.
 * Stores results in context and global state for use by permission checking functions.
 *
 * Usage:
 * ```tsx
 * import { AccessCheck } from '@project-kessel/react-kessel-access-check';
 *
 * <AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/kessel/v1beta2">
 *   <KesselRbacAccessProvider>
 *     <App />
 *   </KesselRbacAccessProvider>
 * </AccessCheck.Provider>
 * ```
 */
export const KesselRbacAccessProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Fetch default workspace ID
  const {
    workspaceId,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useDefaultWorkspace();

  // Build workspace resource for permission checks
  const workspace = useMemo(() => {
    if (!workspaceId) {
      return {
        id: '',
        type: 'rbac/workspace' as const,
        reporter: { type: 'rbac' as const },
      };
    }
    return {
      id: workspaceId,
      type: 'rbac/workspace' as const,
      reporter: { type: 'rbac' as const },
    };
  }, [workspaceId]);

  // Check permissions for advisor wildcard permissions
  const advisorAllAll = useSelfAccessCheck({
    relation: 'advisor_all_all',
    resource: workspace,
  });

  const advisorAllRead = useSelfAccessCheck({
    relation: 'advisor_all_read',
    resource: workspace,
  });

  const advisorRulesRead = useSelfAccessCheck({
    relation: 'advisor_rules_read',
    resource: workspace,
  });

  // Aggregate loading states
  const isLoading =
    workspaceLoading ||
    advisorAllAll.loading ||
    advisorAllRead.loading ||
    advisorRulesRead.loading;

  const contextValue: KesselRbacAccessContextValue = useMemo(() => {
    // Build raw Kessel permission results
    const kesselPermissions: KesselPermissionResult[] = [
      {
        relation: 'advisor_all_all',
        allowed: !!workspaceId && (advisorAllAll.data?.allowed ?? false),
      },
      {
        relation: 'advisor_all_read',
        allowed: !!workspaceId && (advisorAllRead.data?.allowed ?? false),
      },
      {
        relation: 'advisor_rules_read',
        allowed: !!workspaceId && (advisorRulesRead.data?.allowed ?? false),
      },
    ];

    // Map Kessel permissions to v1 format for backward compatibility
    const permissions: V1Permission[] = kesselPermissions
      .filter((kp) => kp.allowed)
      .map((kp) => {
        // Map relation name back to v1 permission format
        // advisor_all_all → advisor:*:*
        // advisor_all_read → advisor:*:read
        // advisor_rules_read → advisor:rules:read
        const parts = kp.relation.split('_');
        if (parts.length === 3) {
          const [app, resource, verb] = parts;
          const v1Resource = resource === 'all' ? '*' : resource;
          const v1Verb = verb === 'all' ? '*' : verb;
          return {
            permission: `${app}:${v1Resource}:${v1Verb}`,
            resourceDefinitions: [],
          };
        }
        return { permission: kp.relation, resourceDefinitions: [] };
      });

    const errors: Error[] = [];
    if (workspaceError) {
      errors.push(
        new Error(`Workspace error: ${workspaceError.message || 'Unknown error'}`)
      );
    }
    if (advisorAllAll.error) {
      errors.push(
        new Error(`Permission check error (advisor_all_all): ${advisorAllAll.error.message || 'Unknown error'}`)
      );
    }
    if (advisorAllRead.error) {
      errors.push(
        new Error(`Permission check error (advisor_all_read): ${advisorAllRead.error.message || 'Unknown error'}`)
      );
    }
    if (advisorRulesRead.error) {
      errors.push(
        new Error(`Permission check error (advisor_rules_read): ${advisorRulesRead.error.message || 'Unknown error'}`)
      );
    }

    return {
      workspaceId,
      isLoading,
      permissions,
      kesselPermissions,
      errors,
    };
  }, [
    workspaceId,
    isLoading,
    workspaceError,
    advisorAllAll.data?.allowed,
    advisorAllAll.error,
    advisorAllRead.data?.allowed,
    advisorAllRead.error,
    advisorRulesRead.data?.allowed,
    advisorRulesRead.error,
  ]);

  // Inject into global state for backward compatibility with functions.js
  useEffect(() => {
    // eslint-disable-next-line rulesdir/no-chrome-api-call-from-window
    if (window.insights?.chrome) {
      // eslint-disable-next-line rulesdir/no-chrome-api-call-from-window
      (window.insights.chrome as any)._kesselPermissions = contextValue.kesselPermissions;
      // eslint-disable-next-line rulesdir/no-chrome-api-call-from-window
      (window.insights.chrome as any)._kesselMappedPermissions = contextValue.permissions;
    }
  }, [contextValue]);

  return React.createElement(
    KesselRbacAccessContext.Provider,
    { value: contextValue },
    children
  );
};

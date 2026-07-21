import React, { createContext, useContext, useMemo } from 'react';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import type { SelfAccessCheckResourceWithRelation } from '@project-kessel/react-kessel-access-check';
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
  workspaceId: string | undefined;
  isLoading: boolean;
  permissions: V1Permission[];
  kesselPermissions: KesselPermissionResult[];
  errors: Error[];
}

const DEFAULT_CONTEXT: KesselRbacAccessContextValue = {
  workspaceId: undefined,
  isLoading: true,
  permissions: [],
  kesselPermissions: [],
  errors: [],
};

export const KesselRbacAccessContext =
  createContext<KesselRbacAccessContextValue>(DEFAULT_CONTEXT);

export const useKesselRbacAccess = (): KesselRbacAccessContextValue => {
  return useContext(KesselRbacAccessContext);
};

const ADVISOR_RELATIONS = [
  'advisor_all_all',
  'advisor_all_read',
  'advisor_rules_read',
] as const;

type NonEmptyResources = [
  SelfAccessCheckResourceWithRelation,
  ...SelfAccessCheckResourceWithRelation[]
];

function mapRelationToV1Permission(relation: string): string {
  const parts = relation.split('_');
  if (parts.length === 3) {
    const [app, resource, verb] = parts;
    const v1Resource = resource === 'all' ? '*' : resource;
    const v1Verb = verb === 'all' ? '*' : verb;
    return `${app}:${v1Resource}:${v1Verb}`;
  }
  return relation;
}

/**
 * Provider for Kessel v2 RBAC.
 *
 * Fetches the default workspace and checks all required permissions in a single
 * bulk API call. When the workspace ID is not yet available, an empty resources
 * array is passed so the hook completes immediately without an API call.
 */
export const KesselRbacAccessProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const {
    workspaceId,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useDefaultWorkspace();

  const resources = useMemo<NonEmptyResources | undefined>(() => {
    if (!workspaceId) {
      return undefined;
    }

    return ADVISOR_RELATIONS.map((relation) => ({
      id: workspaceId,
      type: 'workspace' as const,
      reporter: { type: 'rbac' as const },
      relation,
    })) as NonEmptyResources;
  }, [workspaceId]);

  const bulkResult = useSelfAccessCheck({
    resources: (resources ?? []) as NonEmptyResources,
  });

  const isLoading = workspaceLoading || bulkResult.loading;

  const contextValue: KesselRbacAccessContextValue = useMemo(() => {
    const kesselPermissions: KesselPermissionResult[] = ADVISOR_RELATIONS.map(
      (relation) => {
        const item = bulkResult.data?.find((d) => d.relation === relation);
        return {
          relation,
          allowed: !!workspaceId && (item?.allowed ?? false),
        };
      }
    );

    const permissions: V1Permission[] = kesselPermissions
      .filter((kp) => kp.allowed)
      .map((kp) => ({
        permission: mapRelationToV1Permission(kp.relation),
        resourceDefinitions: [],
      }));

    const errors: Error[] = [];
    if (workspaceError) {
      errors.push(
        new Error(
          `Workspace error: ${workspaceError.message || 'Unknown error'}`
        )
      );
    }
    if (bulkResult.error) {
      errors.push(
        new Error(
          `Permission check error: ${
            bulkResult.error.message || 'Unknown error'
          }`
        )
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
    bulkResult.data,
    bulkResult.error,
  ]);

  return React.createElement(
    KesselRbacAccessContext.Provider,
    { value: contextValue },
    children
  );
};

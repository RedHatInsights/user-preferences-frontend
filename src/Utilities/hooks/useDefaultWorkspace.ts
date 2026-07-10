import { useEffect, useState } from 'react';
import {
  Workspace,
  fetchDefaultWorkspace,
} from '@project-kessel/react-kessel-access-check';

/**
 * Hook to fetch and cache the default workspace ID.
 * Fetches from /api/rbac/v2/workspaces/?type=default
 */
export const useDefaultWorkspace = () => {
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const fetchWorkspace = async () => {
      try {
        // Use the current origin as the RBAC base endpoint
        const rbacBaseEndpoint = window.location.origin;

        const workspace: Workspace = await fetchDefaultWorkspace(
          rbacBaseEndpoint
        );

        if (isMounted) {
          setWorkspaceId(workspace.id);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to fetch default workspace')
          );
          setIsLoading(false);
        }
      }
    };

    fetchWorkspace();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    workspaceId,
    isLoading,
    error,
  };
};

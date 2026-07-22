import { useEffect, useState } from 'react';
import { RhsmSubscriptionsUtilizationClient } from '@redhat-cloud-services/rhsm-subscriptions-utilization-client/api';

/**
 * Hook to fetch the organization's custom subscription threshold percentage.
 * Fetches from /api/rhsm-subscriptions/v1/preferences
 */
export const useCustomThreshold = () => {
  const [threshold, setThreshold] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const fetchThreshold = async () => {
      try {
        // Use the current origin as the base endpoint
        const basePath = window.location.origin;

        // Create the API client
        const client = RhsmSubscriptionsUtilizationClient(basePath);

        // Fetch the org preferences
        const response = await client.getOrgPreferences();

        if (isMounted) {
          setThreshold(response.data.custom_threshold);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to fetch custom threshold')
          );
          setIsLoading(false);
        }
      }
    };

    fetchThreshold();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    threshold,
    isLoading,
    error,
  };
};

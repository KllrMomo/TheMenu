import { useQuery } from "@tanstack/react-query";

import { Api } from "../../api";
import type { Restaurant } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useRestaurantByOwner = () => {
  // Check token directly (synchronous) - no state needed
  // This ensures the query is enabled immediately on mount
  const hasToken = !!Api.getToken();
  
  return useQuery<Restaurant | null, Error>({
    queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
    queryFn: () => Api.getRestaurantByOwner(),
    enabled: hasToken, // Only fetch if user is authenticated
    // Always refetch on mount to ensure we have the latest data
    // This is important because cached null values might be stale
    refetchOnMount: "always",
    // Keep data fresh for 30 seconds - reduces unnecessary refetches
    staleTime: 30 * 1000,
    // Cache data for 5 minutes
    gcTime: 5 * 60 * 1000,
    // Refetch when window regains focus (user might have made changes in another tab)
    refetchOnWindowFocus: true,
    // Always refetch on reconnect
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (authentication errors) - token is invalid/expired
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          return false;
        }
      }
      // Don't retry on 404 errors (user doesn't have a restaurant)
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return false;
        }
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    // Don't throw errors to console - handle them in components
    throwOnError: false,
  });
};

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Api } from "../../api";
import type { Restaurant } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useRestaurantByOwner = () => {
  // Use state to track token so the query can react to token changes
  const [hasToken, setHasToken] = useState(() => !!Api.getToken());

  // Update token state when it changes
  useEffect(() => {
    const checkToken = () => {
      setHasToken(!!Api.getToken());
    };
    
    // Check immediately
    checkToken();
    
    // Also listen for storage changes (in case token is set in another tab/window)
    window.addEventListener("storage", checkToken);
    
    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);
  
  return useQuery<Restaurant | null, Error>({
    queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
    queryFn: () => Api.getRestaurantByOwner(),
    enabled: hasToken, // Only fetch if user is authenticated
    // Always refetch on mount to ensure we have the latest data
    refetchOnMount: "always",
    // Don't use stale data - always check for fresh data
    staleTime: 0,
    // Cache data for a short time only (5 minutes)
    gcTime: 5 * 60 * 1000,
    // Refetch when window regains focus
    refetchOnWindowFocus: true,
    // Always refetch on reconnect
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (authentication errors)
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

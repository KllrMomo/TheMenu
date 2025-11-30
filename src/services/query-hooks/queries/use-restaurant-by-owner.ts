import { useQuery } from "@tanstack/react-query";

import { Api } from "../../api";
import type { Restaurant } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useRestaurantByOwner = () => {
  return useQuery<Restaurant | null, Error>({
    queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
    queryFn: () => Api.getRestaurantByOwner(),
    enabled: !!Api.getToken(), // Only fetch if user is authenticated
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

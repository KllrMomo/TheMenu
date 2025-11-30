import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Api } from "../../api";
import type { CreateRestaurantRequest, Restaurant } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation<Restaurant, Error, CreateRestaurantRequest>({
    mutationFn: (data: CreateRestaurantRequest) => Api.createRestaurant(data.name, data.address),
    onSuccess: (data) => {
      // Reset and set the query data to immediately update the cache
      // This ensures the dashboard shows the restaurant right away
      queryClient.resetQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
        exact: true,
      });

      // Directly set the query data with the new restaurant
      queryClient.setQueryData([QUERY_KEYS.GET_RESTAURANT_BY_OWNER], data);

      // Also invalidate to ensure all related queries are updated
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANTS],
      });
    },
  });
};

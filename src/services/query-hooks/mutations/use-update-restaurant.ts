import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Api } from "../../api";
import type { Restaurant } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

interface UpdateRestaurantParams {
  restaurantId: string;
  name?: string;
  address?: string;
}

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation<Restaurant, Error, UpdateRestaurantParams>({
    mutationFn: ({ restaurantId, ...data }) =>
      Api.updateRestaurant(restaurantId, data.name, data.address),
    onSuccess: (data) => {
      // Directly set the updated restaurant data in cache
      // This ensures the UI updates immediately without waiting for refetch
      queryClient.setQueryData([QUERY_KEYS.GET_RESTAURANT_BY_OWNER], data);
      queryClient.setQueryData([QUERY_KEYS.GET_RESTAURANT, data.restaurantId], data);

      // Also invalidate to ensure all related queries are updated
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANT, data.restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANTS],
      });
    },
  });
};

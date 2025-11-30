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
      // Invalidate the specific restaurant
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANT, data.restaurantId],
      });

      // Invalidate restaurant by owner query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
      });

      // Invalidate restaurants list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANTS],
      });
    },
  });
};

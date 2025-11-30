import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Api } from "../../api";
import type { FoodItem } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

interface UpdateFoodItemParams {
  id: string;
  name?: string;
  price?: number;
  inStock?: boolean;
}

export const useUpdateFoodItem = () => {
  const queryClient = useQueryClient();

  return useMutation<FoodItem, Error, UpdateFoodItemParams>({
    mutationFn: ({ id, ...data }) => Api.updateFoodItem(id, data.name, data.price, data.inStock),
    onSuccess: (data) => {
      // Invalidate the specific food item
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOOD_ITEM, data.foodId],
      });

      // Invalidate food items list for the restaurant
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOOD_ITEMS, data.restaurantId],
      });
    },
  });
};

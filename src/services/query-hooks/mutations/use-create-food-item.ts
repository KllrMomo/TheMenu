import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Api } from "../../api";
import type { CreateFoodItemRequest, FoodItem } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useCreateFoodItem = () => {
  const queryClient = useQueryClient();

  return useMutation<FoodItem, Error, CreateFoodItemRequest>({
    mutationFn: (data: CreateFoodItemRequest) =>
      Api.createFoodItem(data.restaurantId, data.name, data.price, data.inStock),
    onSuccess: (_, variables) => {
      // Invalidate food items list for the restaurant
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOOD_ITEMS, variables.restaurantId],
      });
    },
  });
};

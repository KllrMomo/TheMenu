import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Api } from "../../api";
import { QUERY_KEYS } from "../query-keys";

export const useDeleteFoodItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (foodId: string) => Api.deleteFoodItem(foodId),
    onSuccess: (_, foodId) => {
      // Invalidate relevant queries to refetch updated menu
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOOD_ITEMS],
      });

      // Invalidate restaurant by owner query (which includes food items)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
      });

      // Optionally remove from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.GET_FOOD_ITEM, foodId],
      });
    },
  });
};



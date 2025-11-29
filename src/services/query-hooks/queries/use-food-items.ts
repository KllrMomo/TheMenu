import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api";
import type { FoodItem } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useFoodItems = (restaurantId: string | undefined) => {
  return useQuery<FoodItem[], Error>({
    queryKey: [QUERY_KEYS.GET_FOOD_ITEMS, restaurantId],
    queryFn: () => {
      if (!restaurantId) throw new Error("Restaurant ID is required");
      return Api.listFoodItemsByRestaurant(restaurantId);
    },
    enabled: !!restaurantId,
  });
};


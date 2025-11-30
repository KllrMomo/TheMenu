import { useQuery } from "@tanstack/react-query";

import { Api } from "../../api";
import type { FoodItem } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useFoodItem = (id: string | undefined) => {
  return useQuery<FoodItem, Error>({
    queryKey: [QUERY_KEYS.GET_FOOD_ITEM, id],
    queryFn: () => {
      if (!id) throw new Error("Food item ID is required");
      return Api.getFoodItemById(id);
    },
    enabled: !!id,
  });
};

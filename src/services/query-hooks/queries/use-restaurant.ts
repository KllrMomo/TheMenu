import { useQuery } from "@tanstack/react-query";

import { Api } from "../../api";
import type { Restaurant } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useRestaurant = (id: string | undefined) => {
  return useQuery<Restaurant, Error>({
    queryKey: [QUERY_KEYS.GET_RESTAURANT, id],
    queryFn: () => {
      if (!id) throw new Error("Restaurant ID is required");
      return Api.getRestaurantById(id);
    },
    enabled: !!id,
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api";
import type { CreateRestaurantRequest, Restaurant } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation<Restaurant, Error, CreateRestaurantRequest>({
    mutationFn: (data: CreateRestaurantRequest) =>
      Api.createRestaurant(data.name, data.address),
    onSuccess: () => {
      // Invalidate restaurants list to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RESTAURANTS] });
    },
  });
};


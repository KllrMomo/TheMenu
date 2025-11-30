import { useMutation } from "@tanstack/react-query";

import { Api } from "../../api";
import type { CreateRestaurantRequest, Restaurant } from "../../api_types";

export const useCreateRestaurant = () => {
  return useMutation<Restaurant, Error, CreateRestaurantRequest>({
    mutationFn: (data: CreateRestaurantRequest) => Api.createRestaurant(data.name, data.address),
    // Note: Not invalidating GET_RESTAURANTS here to avoid 401 errors during signup
    // The query will be refetched naturally when the restaurants list is next accessed
  });
};

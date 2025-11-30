import { useQuery } from "@tanstack/react-query";

import { Api } from "../../api";
import type { Restaurant } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useRestaurants = () => {
  return useQuery<Restaurant[], Error>({
    queryKey: [QUERY_KEYS.GET_RESTAURANTS],
    queryFn: () => Api.listRestaurants(),
  });
};

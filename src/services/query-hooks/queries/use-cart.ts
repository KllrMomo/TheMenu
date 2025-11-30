import { useQuery } from "@tanstack/react-query";

import { Api } from "../../api";
import type { Cart } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useCart = () => {
  return useQuery<Cart | null, Error>({
    queryKey: [QUERY_KEYS.GET_CART],
    queryFn: () => Api.getCart(),
  });
};

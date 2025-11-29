import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api";
import type { CheckoutResponse } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponse, Error, void>({
    mutationFn: () => Api.checkout(),
    onSuccess: () => {
      // Invalidate cart to refetch (should be empty after checkout)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
  });
};


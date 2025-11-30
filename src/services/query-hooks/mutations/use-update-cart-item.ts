import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Api } from "../../api";
import type { CartItem, UpdateCartItemRequest } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

interface UpdateCartItemParams {
  itemId: string;
  quantity?: number;
  userNote?: string;
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, UpdateCartItemParams>({
    mutationFn: ({ itemId, ...data }) => Api.updateCartItem(itemId, data.quantity, data.userNote),
    onSuccess: () => {
      // Invalidate cart to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api";
import type { AddCartItemRequest, CartItem } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, AddCartItemRequest>({
    mutationFn: (data: AddCartItemRequest) =>
      Api.addCartItem(
        data.restaurantId,
        data.foodId,
        data.quantity,
        data.userNote,
      ),
    onSuccess: () => {
      // Invalidate cart to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
  });
};


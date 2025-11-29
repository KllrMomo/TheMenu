import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api";
import { QUERY_KEYS } from "../query-keys";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (itemId: string) => Api.removeCartItem(itemId),
    onSuccess: () => {
      // Invalidate cart to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
  });
};


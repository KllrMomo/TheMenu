import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Api } from "../../api";
import type { UpdateUserRequest, User } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserRequest>({
    mutationFn: (data: UpdateUserRequest) =>
      Api.updateUser(data.firstName, data.lastName, data.email),
    onSuccess: () => {
      // Invalidate user query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};



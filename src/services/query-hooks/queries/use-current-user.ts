import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api";
import type { User } from "../../api_types";
import { QUERY_KEYS } from "../query-keys";

export const useCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: () => Api.getCurrentUser(),
  });
};


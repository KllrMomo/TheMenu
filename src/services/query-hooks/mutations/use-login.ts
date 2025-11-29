import { useMutation } from "@tanstack/react-query";
import { Api } from "../../api";
import type { LoginRequest, AuthResponse } from "../../api_types";

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) =>
      Api.login(credentials.email, credentials.password),
  });
};


import { useMutation } from "@tanstack/react-query";
import { Api } from "../../api";
import type { RegisterRequest, AuthResponse } from "../../api_types";

export const useSignup = () => {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (data: RegisterRequest) =>
      Api.register(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
      ),
  });
};


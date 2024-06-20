"use client";
import {
  CurrentUserResponseType,
  LoginInputType,
  LoginResponseType,
  RegisterCompanyInputType,
  RegisterUserInputType,
} from "@/types/services/auth.types";
import { AUTH_KEY } from "@/utils/constants";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  currentUser,
  login,
  logout,
  registerCompany,
  registerUser,
} from "./auth.services";
import { ErrorResponseType, SuccessResponseType } from "./types.common";

export const useLogin = (
  options?: UseMutationOptions<
    LoginResponseType,
    ErrorResponseType,
    LoginInputType
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: login,
    async onSuccess(data, variables, context) {
      localStorage.setItem(AUTH_KEY, data.token);
      const checkAuthKey = setInterval(() => {
        if (Boolean(localStorage.getItem(AUTH_KEY))) {
          clearInterval(checkAuthKey);
          options?.onSuccess?.(data, variables, context);
        }
      }, 100);
    },
  });
};

export const useRegisterUser = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    RegisterUserInputType
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: registerUser,
  });
};

export const useRegisterCompany = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    RegisterCompanyInputType
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: registerCompany,
  });
};

export const useCurrentUser = (
  options?: UseQueryOptions<CurrentUserResponseType, ErrorResponseType>,
) => {
  return useQuery({
    ...options,
    queryFn: () => currentUser(),
    queryKey: [currentUser.name],
  });
};

export const useLogout = (
  options?: UseMutationOptions<null, ErrorResponseType, any>,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    ...options,
    mutationFn: logout,
    onSuccess(data, variables, context) {
      localStorage.removeItem(AUTH_KEY);
      queryClient.removeQueries({ queryKey: [currentUser.name] });
      options?.onSuccess?.(data, variables, context);
      router.push("/signin");
    },
  });
};

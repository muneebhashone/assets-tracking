"use client";
import {
  ChangePasswordInputType,
  CurrentUserResponseType,
  ForgetPasswordInputType,
  LoginInputType,
  LoginResponseType,
  RegisterCompanyInputType,
  RegisterUserInputType,
  ResetPasswordInputType,
  SetPasswordInputType,
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
  changePassword,
  currentUser,
  forgetPassword,
  login,
  logout,
  registerCompany,
  registerUser,
  resetPassword,
  setPassword,
} from "./auth.services";
import { ErrorResponseType, SuccessResponseType } from "./types.common";
import { getAllCompanies } from "./companies.queries";

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
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: registerCompany,
    onSuccess(data, variables, context) {
      queryClient.removeQueries({ queryKey: ["getAllCompanies"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useCurrentUser = (
  options?: UseQueryOptions<CurrentUserResponseType, ErrorResponseType>,
) => {
  return useQuery({
    ...options,
    queryFn: () => currentUser(),
    queryKey: ["currentUser"],
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
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      options?.onSuccess?.(data, variables, context);
      router.push("/signin");
      router.refresh();
    },
  });
};

export const useSetPassword = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    SetPasswordInputType
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: setPassword,
  });
};

export const useResetPassword = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    ResetPasswordInputType
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: resetPassword,
  });
};

export const useForgetPassword = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    ForgetPasswordInputType
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: forgetPassword,
  });
};

export const useChangePassword = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    ChangePasswordInputType
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: changePassword,
  });
};

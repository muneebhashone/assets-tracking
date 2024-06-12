import { apiAxios } from "@/utils/api.utils";
import { AUTH_KEY } from "@/utils/constants";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ErrorResponseType, SuccessResponseType } from "./types.common";
import { AxiosError } from "axios";

export type LoginInputType = {
  email: string;
  password: string;
};

export type RegisterUserInputType = {
  name: string;
  email: string;
  password: string;
  companyId?: string | null;
};

export type RegisterCompanyInputType = {
  name: string;
  email: string;
  password: string;
  companyName: string;
  country: string;
  city: string;
};

export type LoginResponseType = {
  token: string;
};

export interface CurrentUserResponseType {
  user: User;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  password: string;
  status: string;
  credits: number;
  companyId: null;
  permissions: string[];
}

export const login = async (input: LoginInputType) => {
  const { data, status } = await apiAxios.post<LoginResponseType>(
    "/auth/login",
    input,
  );

  return data;
};

export const currentUser = async () => {
  const { data } = await apiAxios.get<CurrentUserResponseType>("/auth/user");

  return data;
};

export const registerUser = async (input: RegisterUserInputType) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    "/auth/register/user",
    input,
  );
  return data;
};

export const registerCompany = async (input: RegisterCompanyInputType) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    "/auth/register/company",
    input,
  );
  return data;
};

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
    queryFn: currentUser,
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
    mutationFn: async () => {
      localStorage.removeItem(AUTH_KEY);
      return null;
    },
    onSuccess(data, variables, context) {
      queryClient.removeQueries({ queryKey: [currentUser.name] });
      options?.onSuccess?.(data, variables, context);
      router.push("/signin");
    },
  });
};

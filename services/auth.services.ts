import {
  CurrentUserResponseType,
  ForgetPasswordInputType,
  LoginInputType,
  LoginResponseType,
  RegisterCompanyInputType,
  RegisterUserInputType,
  ResetPasswordInputType,
  SetPasswordInputType,
} from "@/types/services/auth.types";
import { apiAxios } from "@/utils/api.utils";
import { SuccessResponseType } from "./types.common";

export const login = async (input: LoginInputType) => {
  const { data } = await apiAxios.post<LoginResponseType>("/auth/login", input);

  return data;
};

export const logout = async () => {
  const { data } = await apiAxios.post<null>("/auth/logout");

  return data;
};

export const currentUser = async (accessToken?: string) => {
  const { data } = await apiAxios.get<CurrentUserResponseType>(
    "/auth/user",
    accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
  );

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

export const setPassword = async (input: SetPasswordInputType) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    "/auth/set-password",
    input,
  );
  return data;
};

export const resetPassword = async (input: ResetPasswordInputType) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    "/auth/reset-password",
    input,
  );
  return data;
};

export const forgetPassword = async (input: ForgetPasswordInputType) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    "/auth/forget-password",
    input,
  );
  return data;
};

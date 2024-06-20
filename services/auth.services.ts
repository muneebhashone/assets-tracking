import {
  CurrentUserResponseType,
  LoginInputType,
  LoginResponseType,
  RegisterCompanyInputType,
  RegisterUserInputType,
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

"use client";
import { apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import {
  RegisterCompanyInputType,
  User,
  WalletType,
} from "@/types/services/auth.types";
import { useCurrentUser } from "./auth.mutations";
import { ErrorResponseType, SuccessResponseType } from "./types.common";
import { PaginatorInfoType } from "./user.queries";

//types
export type GetAllCompaniesInputType = {
  searchString?: string;
  limitParam?: number;
  pageParam?: number;
  isParentCompanies?: boolean;
};
export type GetCompanyByIdInputType = {
  id: number;
};

export type GetAllCompaniesResponseType = {
  results: Company[];
  paginatorInfo: PaginatorInfoType;
};

export interface GetCompanyByIdResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: Company;
}

export interface GetAllCompaniesType extends Omit<SuccessResponseType, "data"> {
  data: Company[];
}
export type CompanyStatus = "REJECTED" | "APPROVED" | "REQUESTED";

export type Company = {
  country?: string;
  city?: string;
  parent?: Company;
  status: CompanyStatus;
  id: number;
  name?: string;
  wallet: WalletType;
  users: User[];
  address?: string;
  industry?: string;
  createdAt?: string;
  isActive: boolean;
  updatedAt?: string;
  credits?: number;
};

export type createCompanyInputType = RegisterCompanyInputType & {
  type: "CLIENT" | "WHITE_LABEL";
  parentCompany?: number;
};
//services
export const getAllCompanies = async (input: GetAllCompaniesInputType) => {
  const { data } = await apiAxios.get<GetAllCompaniesResponseType>(
    "/companies",
    { params: { ...input } },
  );

  return data;
};

export const getParentCompanies = async () => {
  const { data } =
    await apiAxios.get<GetAllCompaniesResponseType>("/companies/parent");

  return data;
};

export const getCompanyById = async (input: GetCompanyByIdInputType) => {
  const { data } = await apiAxios.get<GetCompanyByIdResponseType>(
    "/companies",
    { params: { ...input } },
  );

  return data;
};
//hooks
export const useGetCompanies = (
  input: GetAllCompaniesInputType,
  options?: Omit<
    UseQueryOptions<unknown, ErrorResponseType, GetAllCompaniesResponseType>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      unknown,
      ErrorResponseType,
      GetAllCompaniesResponseType
    >["queryKey"];
  },
) => {
  const { data: user } = useCurrentUser();
  return useQuery({
    ...options,
    queryFn: async () => await getAllCompanies(input),
    queryKey: ["getAllCompanies", user?.user.id, JSON.stringify(input)],
    enabled: Boolean(user?.user.id),
  });
};

export const useGetParentCompanies = (
  options?: UseQueryOptions<unknown, ErrorResponseType, GetAllCompaniesType>,
) => {
  return useQuery({
    ...options,
    queryFn: async () => await getParentCompanies(),
    queryKey: ["getParentCompanies"],
  });
};

export const useGetCompanyById = (
  input: GetCompanyByIdInputType,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetCompanyByIdResponseType
  >,
) => {
  const { data: user } = useCurrentUser();
  return useQuery({
    ...options,
    queryFn: async () => await getCompanyById(input),
    queryKey: ["getCompanyById", user?.user.id, JSON.stringify(input)],
    enabled: Boolean(user?.user.id),
  });
};

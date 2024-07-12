"use client";
import { apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { ErrorResponseType, SuccessResponseType } from "./types.common";
import { PaginatorInfoType } from "./user.queries";

//types
export type GetAllCompaniesInputType = {
  searchString?: string;
  limitParam?: number;
  pageParam?: number;
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
export type CompanyStatus = "REJECTED" | "APPROVED" | "REQUESTED";

export type Company = {
  country?: string;
  city?: string;
  status: CompanyStatus;
  id: number;
  name?: string;
  address?: string;
  industry?: string;
  createdAt?: string;
  isActive: boolean;
  updatedAt?: string;
  credits?: number;
};

//services
export const getAllCompanies = async (input: GetAllCompaniesInputType) => {
  const { data } = await apiAxios.get<GetAllCompaniesResponseType>(
    "/companies",
    { params: { ...input } },
  );

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
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetAllCompaniesResponseType
  >,
) => {
  return useQuery({
    ...options,
    queryFn: async () => await getAllCompanies(input),
    queryKey: [getAllCompanies.name, JSON.stringify(input)],
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
  return useQuery({
    ...options,
    queryFn: async () => await getCompanyById(input),
    queryKey: [getCompanyById.name, JSON.stringify(input)],
  });
};

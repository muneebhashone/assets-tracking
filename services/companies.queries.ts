"use client";
import { apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { ErrorResponseType } from "./types.common";
import { PaginatorInfoType } from "./user.queries";

export type GetAllCompaniesInputType = {
  searchString?: string;
  limitParam?: number;
  pageParam?: number;
};

export type GetAllCompaniesResponseType = {
  results: Company[];
  paginatorInfo: PaginatorInfoType;
};

export type CompanyStatus = "REJECTED" | "APPROVED" | "REQUESTED";

export type Company = {
  country: string | null;
  city: string | null;
  status: CompanyStatus;
  id: number;
  name: string | null;
  address: string | null;
  industry: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  credits: number | null;
};

export const getAllCompanies = async (input: GetAllCompaniesInputType) => {
  const { data } = await apiAxios.get<GetAllCompaniesResponseType>(
    "/companies",
    { params: { ...input } },
  );

  return data;
};

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

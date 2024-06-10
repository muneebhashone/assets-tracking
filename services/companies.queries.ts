import { apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getAllShipments } from "@/actions/shipmentActions";
import { ErrorResponseType } from "./types.common";

export type GetAllCompaniesInputType = {
  searchString: string;
  limitParam: number;
  pageParam: number;
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

export type PaginatorInfoType = {
  skip: number;
  limit: number;
  currentPage: number;
  pages: number;
  hasNextPage: boolean;
  totalRecords: number;
  pageSize: number;
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
    queryKey: [getAllShipments.name, JSON.stringify(input)],
  });
};

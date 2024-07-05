//types

import { apiAxios } from "@/utils/api.utils";
import { ErrorResponseType, SuccessResponseType } from "../types.common";
import { PaginatorInfoType } from "../user.queries";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { User } from "@/types/services/auth.types";

export interface SupportType {
  id: number;
  resolved: boolean;
  name: string;
  email: string;
  phoneNo: string;
  subject: string;
  message: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export type SupportFormResponseType = {
  results: SupportType[];
  paginatorInfo: PaginatorInfoType;
};
export type GetAllSupportFormInputType = {
  searchString?: string;
  limitParam?: number;
  pageParam?: number;
  filterByResolved?: number;
};
export type GetSupportFormByIdType = {
  id: number;
};
export interface GetAllSupportFormsResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: SupportFormResponseType;
}

export interface GetSupportFormByIdResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: SupportType;
}
//services

export const getAllSupportForms = async (input: GetAllSupportFormInputType) => {
  const { data } = await apiAxios.get<GetAllSupportFormsResponseType>(
    "/admin/assign",
    {
      params: input,
    },
  );

  return data;
};

export const getSupportFormById = async (input: GetSupportFormByIdType) => {
  const { id } = input;
  const { data } = await apiAxios.get<GetAllSupportFormsResponseType>(
    `/admin/assign/${id}`,
  );

  return data;
};
//hooks

export const useGetAllSupportForms = (
  input: GetAllSupportFormInputType,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetAllSupportFormsResponseType
  >,
) => {
  return useQuery({
    ...options,
    queryFn: async () => await getAllSupportForms(input),
    queryKey: [getAllSupportForms.name, JSON.stringify(input)],
  });
};

export const useGetSupportFormById = (
  input: GetSupportFormByIdType,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetSupportFormByIdResponseType
  >,
) => {
  return useQuery({
    ...options,
    queryFn: async () => await getSupportFormById(input),
    queryKey: [getSupportFormById.name, JSON.stringify(input)],
  });
};

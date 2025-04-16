//types

import { apiAxios } from "@/utils/api.utils";
import type { ErrorResponseType, SuccessResponseType } from "../types.common";
import type { PaginatorInfoType } from "../user.queries";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { User } from "@/types/services/auth.types";
import { useCurrentUser } from "../auth.mutations";

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

export type SupportFormMessageType = {
  message: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  supportFormId: number;
};

export type SupportFormResponseType = {
  results: SupportType[];
  paginatorInfo: PaginatorInfoType;
};
export type GetAllSupportFormInputType = {
  searchString?: string;
  limitParam?: number;
  pageParam?: number;
  filterByResolved?: boolean;
};
export type GetSupportFormByIdType = {
  id: string;
};
export interface GetAllSupportFormsResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: SupportFormResponseType;
}

export interface GetSupportFormByIdResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: SupportType;
}

export interface GetSupportFormMessagesResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: SupportFormMessageType[];
}

//services

export const getAllSupportForms = async (input: GetAllSupportFormInputType) => {
  const { data } = await apiAxios.get<GetAllSupportFormsResponseType>(
    "/admin/support-form",
    {
      params: input,
    },
  );

  return data;
};

export const getSupportFormMessages = async (input: GetSupportFormByIdType) => {
  const { id } = input;
  const { data } = await apiAxios.get<GetSupportFormMessagesResponseType>(
    `/admin/support-form/${id}/messages`,
  );
  return data;
};

export const getSupportFormById = async (input: GetSupportFormByIdType) => {
  const { id } = input;
  const { data } = await apiAxios.get<GetAllSupportFormsResponseType>(
    `/admin/support-form/${id}`,
  );

  return data;
};

export const useGetSupportFormMessages = (
  input: GetSupportFormByIdType,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetSupportFormMessagesResponseType
  >,
) => {
  const { data: user } = useCurrentUser();
  return useQuery({
    ...options,
    queryFn: async () => await getSupportFormMessages(input),
    queryKey: ["getSupportFormMessages", input.id],
    enabled: Boolean(user?.user.id) && Boolean(input.id),
  });
};

export const useGetAllSupportForms = (
  input: GetAllSupportFormInputType,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetAllSupportFormsResponseType
  >,
) => {
  const { data: user } = useCurrentUser();
  return useQuery({
    ...options,
    queryFn: async () => await getAllSupportForms(input),
    queryKey: ["getAllSupportForms", user?.user.id, JSON.stringify(input)],
    enabled: Boolean(user?.user.id),
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
  const { data: user } = useCurrentUser();
  return useQuery({
    ...options,
    queryFn: async () => await getSupportFormById(input),
    queryKey: ["getSupportFormById", input.id],
    enabled: Boolean(user?.user.id) && Boolean(input.id),
  });
};

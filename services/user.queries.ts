import { apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ErrorResponseType, SuccessResponseType } from "./types.common";
import { User } from "@/types/services/auth.types";
import { RoleType } from "@/types/user.types";

//types
export type GetAllUserInputType = {
  searchString?: string;
  limitParam?: number;
  pageParam?: number;
  filterByActive?: string;
  filterByStatus?: ("APPROVED" | "REQUESTED" | "REJECTED")[];
  filterByRole?: RoleType;
};

export type GetAllUserResponseType = {
  results: User[];
  paginatorInfo: PaginatorInfoType;
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
export type GetUserByIdInputType = {
  id: string;
};

export interface GetUserByIdResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: User;
}

//services
export const getUsers = async (input: GetAllUserInputType) => {
  const { data } = await apiAxios.get<GetAllUserResponseType>("/users", {
    params: { ...input },
  });

  return data;
};

export const getUserById = async (input: GetUserByIdInputType) => {
  const { id } = input;
  const { data } = await apiAxios.get<GetUserByIdResponseType>(`/users/${id}`);

  return data;
};

//mutations
export const useGetUsers = (
  input: GetAllUserInputType,
  options?: UseQueryOptions<unknown, ErrorResponseType, GetAllUserResponseType>,
) => {
  return useQuery({
    ...options,
    queryFn: async () => await getUsers(input),
    queryKey: ["getUsers", JSON.stringify(input)],
  });
};

export const useGetUserById = (
  input: GetUserByIdInputType,
  options?: Partial<
    UseQueryOptions<unknown, ErrorResponseType, GetUserByIdResponseType>
  >,
) => {
  return useQuery({
    ...options,
    queryFn: async () => await getUserById(input),
    queryKey: ["getUserById", JSON.stringify(input)],
  });
};

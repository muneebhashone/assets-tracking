import { apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ErrorResponseType } from "./types.common";
import { User } from "./auth.mutations";


export type GetAllUserInputType = {
  searchString?: string;
  limitParam?: number;
  pageParam?: number;
  isRequestedUser?: boolean;
  filterByActive?: boolean;
  filterByStatus?: 'APPROVED' | 'REQUESTED' | 'REJECTED';
  filterByRole?: string;
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

export const getUsers = async (input: GetAllUserInputType) => {
  const { data } = await apiAxios.get<GetAllUserResponseType>("/users", {
    params: { ...input },
  });

  return data;
};

export const useGetUsers = (
  input: GetAllUserInputType,
  options?: UseQueryOptions<unknown, ErrorResponseType, GetAllUserResponseType>,
) => {
  return useQuery({
    ...options,
    queryFn: async () => await getUsers(input),
    queryKey: [getUsers.name, JSON.stringify(input)],
    refetchInterval: 3000,
  });
};

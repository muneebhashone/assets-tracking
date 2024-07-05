import { apiAxios } from "@/utils/api.utils";
import { PaginatorInfoType } from "../user.queries";
import { ErrorResponseType, SuccessResponseType } from "../types.common";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { User } from "@/types/services/auth.types";

//types
export interface AssignsType {
  parentId: number;
  childId: number;
  createdAt: string;
  updatedAt: string;
  child?: User;
  parent?: User;
}
export type AssignsResponseType = {
  results: AssignsType[];
  paginatorInfo: PaginatorInfoType;
};
export interface GetAllAssignsResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: AssignsResponseType;
}

export type GetAllAssignsInputType = {
  searchString?: string;
  limitParam?: number;
  pageParam?: number;
  childId?: number;
  parentId?: number;
};

//services
export const getAssigns = async (input: GetAllAssignsInputType) => {
  const { data } = await apiAxios.get<GetAllAssignsResponseType>(
    "/admin/assign",
    {
      params: input,
    },
  );

  return data;
};

//hooks
export const useGetAssigns = (
  input: GetAllAssignsInputType,
  options?: UseQueryOptions<
    unknown,
    ErrorResponseType,
    GetAllAssignsResponseType
  >,
) => {
  return useQuery({
    ...options,
    queryFn: async () => await getAssigns(input),
    queryKey: [getAssigns.name, JSON.stringify(input)],
  });
};

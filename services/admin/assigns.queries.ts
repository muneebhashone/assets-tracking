import { apiAxios } from "@/utils/api.utils";
import { PaginatorInfoType } from "../user.queries";
import { ErrorResponseType, SuccessResponseType } from "../types.common";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { User } from "@/types/services/auth.types";
import { useCurrentUser } from "../auth.mutations";

//types
export interface AssignsType {
  id: number;
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
  childId?: string;
  parentId?: string;
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
  const { data: user } = useCurrentUser();
  return useQuery({
    ...options,
    queryFn: async () => await getAssigns(input),
    queryKey: ["getAssigns", user?.user.id, JSON.stringify(input)],
    enabled: Boolean(user?.user.id),
  });
};

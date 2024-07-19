import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ErrorResponseType, SuccessResponseType } from "../types.common";
import { apiAxios } from "@/utils/api.utils";
import { getAssigns } from "./assigns.queries";

//types
export type AssignUsersInputType = {
  parentId: string;
  childId: string;
};
export type DeleteAssignUserInputType = {
  assignmentId: number;
};

//services

export const assignUsers = async (input: AssignUsersInputType) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    "/admin/assign",
    input,
  );
  return data;
};

export const deleteAssignment = async (input: DeleteAssignUserInputType) => {
  const { assignmentId } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(
    `/admin/assign/${assignmentId}`,
  );
  return data;
};
//hooks

export const useAssignUsers = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    AssignUsersInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: assignUsers,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getAssigns"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useDeleteAssignment = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteAssignUserInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteAssignment,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getAssigns"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

import { apiAxios } from "@/utils/api.utils";
import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { ErrorResponseType, SuccessResponseType } from "../types.common";

export type CreateSupportMessageInputType = {
  message: string;
  supportFormId: number;
};

export type CreateSupportInputType = {
  name?: string;
  email?: string;
  phoneNo?: string;
  subject?: string;
  message?: string;
  userId?: string;
};

type DeleteSupportInputType = {
  id: number;
};
type ResolveSupportFormInputType = {
  id: number;
};

export const createSupportMessage = async (
  input: CreateSupportMessageInputType,
) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    `/admin/support-form/${input.supportFormId}/message`,
    { message: input.message },
  );
  return data;
};

export const createSupportForm = async (input: CreateSupportInputType) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    "/admin/support-form",
    input,
  );
  return data;
};

export const deleteSupportForm = async (input: DeleteSupportInputType) => {
  const { id } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(
    `/admin/support-form/${id}`,
  );
  return data;
};

export const resolveSupportForm = async (
  input: ResolveSupportFormInputType,
) => {
  const { id } = input;
  const { data } = await apiAxios.post<SuccessResponseType>(
    `/admin/support-form/${id}/resolved`,
  );
  return data;
};

//hooks

export const useCreateSupportForm = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    CreateSupportInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: createSupportForm,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({
        queryKey: ["getAllSupportForms"],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useDeleteSupportForm = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteSupportInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteSupportForm,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({
        queryKey: ["getAllSupportForms"],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useResolveSupportForm = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    ResolveSupportFormInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: resolveSupportForm,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({
        queryKey: ["getAllSupportForms"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["getSupportFormById"],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useCreateSupportMessage = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    CreateSupportMessageInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: createSupportMessage,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({
        queryKey: ["getSupportFormById", variables.supportFormId.toString()],
      });
      await queryClient.invalidateQueries({
        queryKey: [
          "getSupportFormMessages",
          variables.supportFormId.toString(),
        ],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

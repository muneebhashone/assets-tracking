import { apiAxios } from "@/utils/api.utils";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ErrorResponseType, SuccessResponseType } from "../types.common";
import { getAssigns } from "./assigns.queries";
import { getAllSupportForms, getSupportFormById } from "./support.queries";

//types

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
//services

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
        queryKey: [getAllSupportForms.name],
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
        queryKey: [getAllSupportForms.name],
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
        queryKey: [getAllSupportForms.name],
      });
      await queryClient.invalidateQueries({
        queryKey: [getSupportFormById.name],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

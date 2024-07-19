import { apiAxios } from "@/utils/api.utils";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Company, getAllCompanies } from "./companies.queries";

import { ErrorResponseType, SuccessResponseType } from "./types.common";

//types

export interface UpdateCompanyInputType {
  industry?: string;
  address?: string;
  city?: string;
  country?: string;
  name?: string;
  id: number;
}

export interface UpdateCompanyResponseType {
  status: string;
  message: string;
  data: Company;
}

export interface DeleteOrToggleCompanyInputType {
  id: number;
}

//services

export const deleteCompany = async (input: DeleteOrToggleCompanyInputType) => {
  const { id } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(
    `/companies/${id}`,
  );
  return data;
};

export const updateCompany = async (input: UpdateCompanyInputType) => {
  const { id, ...rest } = input;
  const { data } = await apiAxios.patch<UpdateCompanyResponseType>(
    `/companies/${id}`,
    rest,
  );
  return data;
};

export const toggleCompanyActive = async (
  input: DeleteOrToggleCompanyInputType,
) => {
  const { id } = input;
  const { data } = await apiAxios.patch<SuccessResponseType>(
    `/companies/${id}/toggle-active`,
  );
  return data;
};

//hooks

export const useDeleteCompany = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteOrToggleCompanyInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteCompany,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getAllCompanies"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useToggleCompanyActive = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteOrToggleCompanyInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,

    mutationFn: toggleCompanyActive,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getAllCompanies"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdateCompany = (
  options?: UseMutationOptions<
    UpdateCompanyResponseType,
    ErrorResponseType,
    UpdateCompanyInputType
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: updateCompany,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({
        queryKey: ["getAllCompanies"],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

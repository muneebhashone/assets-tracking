import { apiAxios } from "@/utils/api.utils";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { UserWithWallet } from "@/types/services/auth.types";
import { PermissionsType, StatusType } from "@/types/user.types";
import { ErrorResponseType, SuccessResponseType } from "../types.common";

//types
export interface AdminCreateUserInputType {
  email: string;
  name: string;
  phoneNo?: string;
  role: string;
  permissions: PermissionsType[];
  password?: string;
  isActive: boolean;
  status: StatusType;
  companyId?: string;
  clientId?: string;
}
export interface AdminUpdateUserInputType
  extends Partial<AdminCreateUserInputType> {
  id: string;
}

export interface AdminDeleteUserInputType {
  id: number;
}
export interface AdminCreateOrUpdateUserResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: UserWithWallet;
}

//services

const adminCreateUser = async (
  input: AdminCreateUserInputType,
): Promise<AdminCreateOrUpdateUserResponseType> => {
  const { data } = await apiAxios.post<AdminCreateOrUpdateUserResponseType>(
    `/admin/users`,
    input,
  );
  return data;
};

const adminUpdateUser = async (
  input: AdminUpdateUserInputType,
): Promise<AdminCreateOrUpdateUserResponseType> => {
  const { id, ...rest } = input;
  const { data } = await apiAxios.patch<AdminCreateOrUpdateUserResponseType>(
    `/admin/users/${id}`,
    rest,
  );
  return data;
};

const adminDeleteUser = async (
  input: AdminDeleteUserInputType,
): Promise<SuccessResponseType> => {
  const { id } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(
    `/admin/users/${id}`,
  );
  return data;
};

//hooks

export const useAdminCreateUser = (
  options?: UseMutationOptions<
    AdminCreateOrUpdateUserResponseType,
    ErrorResponseType,
    AdminCreateUserInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: adminCreateUser,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useAdminUpdateUser = (
  options?: UseMutationOptions<
    AdminCreateOrUpdateUserResponseType,
    ErrorResponseType,
    AdminUpdateUserInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: adminUpdateUser,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useAdminDeleteUser = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    AdminDeleteUserInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: adminDeleteUser,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

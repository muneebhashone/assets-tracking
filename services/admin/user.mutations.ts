import { apiAxios } from "@/utils/api.utils";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { User } from "@/types/services/auth.types";

import { CreateUserFormSchemaType } from "@/components/page-client/UsersPage";
import { PermissionsType } from "@/types/user.types";
import { ErrorResponseType, SuccessResponseType } from "../types.common";
import { getUsers } from "../user.queries";

//types
export interface AdminCreateUserInputType {
  email: string;
  name: string;
  phoneNo: string;
  role: string;
  permissions: PermissionsType[];
  isActive: true;
  status: string;
  credits: number;
}
export interface AdminUpdateUserInputType
  extends Partial<AdminCreateUserInputType> {
  id: number;
}

export interface AdminDeleteUserInputType {
  id: number;
}
export interface AdminCreateOrUpdateUserResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: User;
}

//services

const adminCreateUser = async (
  input: AdminCreateUserInputType,
): Promise<AdminCreateOrUpdateUserResponseType> => {
  const { data } = await apiAxios.post<AdminCreateOrUpdateUserResponseType>(
    `/api/admin/users`,
    input,
  );
  return data;
};

const adminUpdateUser = async (
  input: AdminUpdateUserInputType,
): Promise<AdminCreateOrUpdateUserResponseType> => {
  const { id, ...rest } = input;
  const { data } = await apiAxios.patch<AdminCreateOrUpdateUserResponseType>(
    `/api/admin/users/${id}`,
    rest,
  );
  return data;
};

const adminDeleteUser = async (
  input: AdminDeleteUserInputType,
): Promise<SuccessResponseType> => {
  const { id, ...rest } = input;
  const { data } = await apiAxios.patch<SuccessResponseType>(
    `/api/admin/users/${id}`,
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
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
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
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
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
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
import { apiAxios } from "@/utils/api.utils";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ErrorResponseType, SuccessResponseType } from "./types.common";

import { User } from "@/types/services/auth.types";
import { currentUser } from "./auth.services";
import { ProfileImageUploadResponseType } from "./upload.mutations";
import { getUsers } from "./user.queries";
import { CreateUserFormSchemaType } from "@/components/forms/user-create-form";

//types
export interface CreateUserInputType {
  email: string;
  name: string;
}

export interface ProfileDataUpdateInputType {
  name: string;
  phoneNo?: string;
  phoneCountryCode?: string;
}

export interface CreateUserResponseType {
  status: string;
  message: string;
  data: User;
}

export interface AssignCreditsInputType {
  id: number;
  credits: number;
}

export interface DeleteUserInputType {
  id: number;
}
export interface DeleteBulkUsersInputType {
  ids: number[];
}

export interface UpdateStatusInputType {
  id: number;
  status: string;
}
export interface UpdateStatusResponseType {
  status: string;
  message: string;
  data: User;
}

export interface UpdatePermissionsInputType {
  id: number;
  permissions: string[];
}

export interface ToggleActiveInputType {
  id: number;
}

//services

export const createClientUser = async (
  input: CreateUserInputType,
): Promise<CreateUserResponseType> => {
  const { data } = await apiAxios.post<CreateUserResponseType>(
    "/users/client-user",
    input,
  );

  return data;
};
export const createWhiteLabelSubAdmin = async (
  input: CreateUserInputType,
): Promise<CreateUserResponseType> => {
  const { data } = await apiAxios.post<CreateUserResponseType>(
    "/users/white-label-sub-admin",
    input,
  );

  return data;
};

export const createClientSuperUser = async (
  input: CreateUserInputType,
): Promise<CreateUserResponseType> => {
  const { data } = await apiAxios.post<CreateUserResponseType>(
    "/users/client-super-user",
    input,
  );

  return data;
};

export const createWhiteLabelAdmin = async (
  input: CreateUserInputType,
): Promise<CreateUserResponseType> => {
  const { data } = await apiAxios.post<CreateUserResponseType>(
    "/users/white-label-admin",
    input,
  );

  return data;
};

export const createSubAdmin = async (
  input: CreateUserInputType,
): Promise<CreateUserResponseType> => {
  const { data } = await apiAxios.post<CreateUserResponseType>(
    "/users/sub-admin",
    input,
  );

  return data;
};

const functionIdentifierByRole = ({
  role,
  input,
}: {
  role: string;
  input: CreateUserInputType;
}): Promise<CreateUserResponseType> => {
  switch (role) {
    case "CLIENT_SUPER_USER":
      return createClientSuperUser(input);
    case "CLIENT_USER":
      return createClientUser(input);
    case "SUB_ADMIN":
      return createSubAdmin(input);
    case "CLIENT_SUPER_USER":
      return createClientSuperUser(input);
    case "WHITE_LABEL_ADMIN":
      return createWhiteLabelAdmin(input);
    case "WHITE_LABEL_SUB_ADMIN":
      return createWhiteLabelSubAdmin(input);

    default:
      return createClientUser(input);
  }
};

const updateStatus = async (
  input: UpdateStatusInputType,
): Promise<UpdateStatusResponseType> => {
  const { id, status } = input;
  const { data } = await apiAxios.post<UpdateStatusResponseType>(
    `/users/${id}/status`,
    { status },
  );
  return data;
};
export const updatePermissions = async (input: UpdatePermissionsInputType) => {
  const { id, permissions } = input;
  const { data } = await apiAxios.post<SuccessResponseType>(
    `/users/${id}/permissions`,
    { permissions },
  );
  return data;
};

export const userToggleActive = async (input: ToggleActiveInputType) => {
  const { id } = input;
  const { data } = await apiAxios.get<SuccessResponseType>(
    `/users/${id}/toggle-active`,
  );
  return data;
};

export const assignCredits = async (input: AssignCreditsInputType) => {
  const { id, credits } = input;
  const { data } = await apiAxios.post<SuccessResponseType>(
    `/users/${id}/credits`,
    { credits },
  );
  return data;
};

export const deleteUser = async (input: DeleteUserInputType) => {
  const { id } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(`/users/${id}`);
  return data;
};

export const deleteBulkUsers = async (input: DeleteBulkUsersInputType) => {
  const { ids } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(`/users/bulk`, {
    params: { ids },
  });
  return data;
};

export const profileUpdateData = async (input: ProfileDataUpdateInputType) => {
  const { data } = await apiAxios.patch<ProfileImageUploadResponseType>(
    `/users/profile`,
    input,
  );
  return data;
};

//hooks

export const useCreateUser = (
  options?: UseMutationOptions<
    CreateUserResponseType,
    ErrorResponseType,
    CreateUserFormSchemaType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data) => {
      const { role, ...rest } = data;
      return functionIdentifierByRole({ role: role, input: rest });
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdateStatus = (
  options?: UseMutationOptions<
    UpdateStatusResponseType,
    ErrorResponseType,
    UpdateStatusInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: updateStatus,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdatePermissions = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    UpdatePermissionsInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: updatePermissions,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useUserToggleActive = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    ToggleActiveInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: userToggleActive,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useAssignCredits = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    AssignCreditsInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: assignCredits,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useDeleteUser = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteUserInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteUser,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useBulkDeleteUser = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteBulkUsersInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteBulkUsers,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getUsers.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdateProfileData = (
  options?: UseMutationOptions<
    ProfileImageUploadResponseType,
    ErrorResponseType,
    ProfileDataUpdateInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: profileUpdateData,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [currentUser.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

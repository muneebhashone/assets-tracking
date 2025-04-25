import { apiAxios } from "@/utils/api.utils";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ErrorResponseType, SuccessResponseType } from "./types.common";
import type {
  Changelog,
  ChangelogChanges,
  ChangelogType,
} from "@/types/services/changelog.types";

// Types
export interface CreateChangelogInputType {
  title: string;
  description: string;
  type: ChangelogType;
  releaseDate?: string;
  changes?: ChangelogChanges;
}

export interface UpdateChangelogInputType {
  id: number;
  title?: string;
  description?: string;
  type?: ChangelogType;
  releaseDate?: string;
  changes?: ChangelogChanges;
}

export interface DeleteChangelogInputType {
  id: number;
}

export interface ChangelogResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: Changelog;
}

// Services
export const createChangelog = async (
  input: CreateChangelogInputType,
): Promise<ChangelogResponseType> => {
  const { data } = await apiAxios.post<ChangelogResponseType>(
    "/changelogs",
    input,
  );
  return data;
};

export const updateChangelog = async (
  input: UpdateChangelogInputType,
): Promise<ChangelogResponseType> => {
  const { id, ...updateData } = input;
  const { data } = await apiAxios.put<ChangelogResponseType>(
    `/changelogs/${id}`,
    updateData,
  );
  return data;
};

export const deleteChangelog = async (
  input: DeleteChangelogInputType,
): Promise<SuccessResponseType> => {
  const { id } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(
    `/changelogs/${id}`,
  );
  return data;
};

// Hooks
export const useCreateChangelog = (
  options?: UseMutationOptions<
    ChangelogResponseType,
    ErrorResponseType,
    CreateChangelogInputType
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChangelog,
    ...options,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getChangelogs"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdateChangelog = (
  options?: UseMutationOptions<
    ChangelogResponseType,
    ErrorResponseType,
    UpdateChangelogInputType
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateChangelog,
    ...options,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getChangelogs"] });
      await queryClient.invalidateQueries({
        queryKey: ["getChangelogById", variables.id],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useDeleteChangelog = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteChangelogInputType
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChangelog,
    ...options,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getChangelogs"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

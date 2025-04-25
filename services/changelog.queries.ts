import { apiAxios } from "@/utils/api.utils";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { ErrorResponseType, SuccessResponseType } from "./types.common";
import type {
  Changelog,
  PaginatedChangelogs,
} from "@/types/services/changelog.types";
import { useCurrentUser } from "./auth.mutations";

// Types
export type GetAllChangelogsInputType = {
  limitParam?: number;
  pageParam?: number;
  type?: string;
};

export interface GetChangelogByIdResponseType
  extends Omit<SuccessResponseType, "data"> {
  data: Changelog;
}

// Services
export const getChangelogs = async (input: GetAllChangelogsInputType) => {
  const { data } = await apiAxios.get<PaginatedChangelogs>("/changelogs", {
    params: { ...input },
  });

  return data;
};

export const getChangelogById = async (id: number) => {
  const { data } = await apiAxios.get<GetChangelogByIdResponseType>(
    `/changelogs/${id}`,
  );
  return data;
};

// Hooks
export const useGetChangelogs = (
  input: GetAllChangelogsInputType,
  options?: UseQueryOptions<unknown, ErrorResponseType, PaginatedChangelogs>,
) => {
  const { data: user } = useCurrentUser();

  return useQuery({
    ...options,
    queryFn: async () => await getChangelogs(input),
    queryKey: ["getChangelogs", user?.user.id, JSON.stringify(input)],
    enabled: Boolean(user?.user.id),
  });
};

export const useGetChangelogById = (
  id: number,
  options?: Partial<
    UseQueryOptions<unknown, ErrorResponseType, GetChangelogByIdResponseType>
  >,
) => {
  const { data: user } = useCurrentUser();

  return useQuery({
    ...options,
    queryFn: async () => await getChangelogById(id),
    queryKey: ["getChangelogById", user?.user.id, id],
    enabled: Boolean(user?.user.id),
  });
};

import { apiAxios } from "@/utils/api.utils";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { ErrorResponseType, SuccessResponseType } from "./types.common";
import type {
	SyncHealthData,
	SyncHistoryItem,
	FailedSync,
	SyncStatistics,
	CircuitBreakerStatus,
	GetSyncHistoryInput,
	GetFailedSyncsInput,
	GetSyncStatsInput,
	PaginatedSyncHistory,
} from "@/types/services/monitoring.types";
import { useCurrentUser } from "./auth.mutations";

// Response Types
export interface GetSyncHealthResponseType
	extends Omit<SuccessResponseType, "data"> {
	data: SyncHealthData;
}

export interface GetSyncHistoryResponseType
	extends Omit<SuccessResponseType, "data"> {
	data: SyncHistoryItem[];
}

export interface GetFailedSyncsResponseType
	extends Omit<SuccessResponseType, "data"> {
	data: FailedSync[];
}

export interface GetSyncStatsResponseType
	extends Omit<SuccessResponseType, "data"> {
	data: SyncStatistics;
}

export interface GetCircuitBreakerResponseType
	extends Omit<SuccessResponseType, "data"> {
	data: CircuitBreakerStatus;
}

// Service Functions
export const getSyncHealth = async () => {
	const { data } = await apiAxios.get<GetSyncHealthResponseType>(
		"/monitoring/health",
	);
	return data;
};

export const getSyncHistory = async (input: GetSyncHistoryInput) => {
	const { data } = await apiAxios.get<GetSyncHistoryResponseType>(
		`/monitoring/shipments/${input.id}/sync-history`,
		{
			params: { limit: input.limit },
		},
	);
	return data;
};

export const getFailedSyncs = async (input: GetFailedSyncsInput = {}) => {
	const { data } = await apiAxios.get<GetFailedSyncsResponseType>(
		"/monitoring/failed-syncs",
		{
			params: input,
		},
	);
	return data;
};

export const getSyncStats = async (input: GetSyncStatsInput = {}) => {
	const { data } = await apiAxios.get<GetSyncStatsResponseType>(
		"/monitoring/stats",
		{
			params: input,
		},
	);
	return data;
};

export const getCircuitBreakerStatus = async () => {
	const { data } = await apiAxios.get<GetCircuitBreakerResponseType>(
		"/monitoring/circuit-breaker",
	);
	return data;
};

// React Query Hooks
export const useSyncHealth = (
	options?: UseQueryOptions<
		unknown,
		ErrorResponseType,
		GetSyncHealthResponseType
	>,
) => {
	const { data: user } = useCurrentUser();

	return useQuery({
		...options,
		queryFn: getSyncHealth,
		queryKey: ["syncHealth", user?.user.id],
		enabled: Boolean(user?.user.id && user?.user.role === "SUPER_ADMIN"),
		refetchInterval: 30000, // Refetch every 30 seconds
	});
};

export const useSyncHistory = (
	input: GetSyncHistoryInput,
	options?: UseQueryOptions<
		unknown,
		ErrorResponseType,
		GetSyncHistoryResponseType
	>,
) => {
	const { data: user } = useCurrentUser();

	return useQuery({
		...options,
		queryFn: () => getSyncHistory(input),
		queryKey: ["syncHistory", user?.user.id, input.id, input.limit],
		enabled: Boolean(
			user?.user.id && user?.user.role === "SUPER_ADMIN" && input.id,
		),
	});
};

export const useFailedSyncs = (
	input: GetFailedSyncsInput = {},
	options?: UseQueryOptions<
		unknown,
		ErrorResponseType,
		GetFailedSyncsResponseType
	>,
) => {
	const { data: user } = useCurrentUser();

	return useQuery({
		...options,
		queryFn: () => getFailedSyncs(input),
		queryKey: ["failedSyncs", user?.user.id, JSON.stringify(input)],
		enabled: Boolean(user?.user.id && user?.user.role === "SUPER_ADMIN"),
		refetchInterval: 60000, // Refetch every minute
	});
};

export const useSyncStats = (
	input: GetSyncStatsInput = {},
	options?: UseQueryOptions<
		unknown,
		ErrorResponseType,
		GetSyncStatsResponseType
	>,
) => {
	const { data: user } = useCurrentUser();

	return useQuery({
		...options,
		queryFn: () => getSyncStats(input),
		queryKey: ["syncStats", user?.user.id, JSON.stringify(input)],
		enabled: Boolean(user?.user.id && user?.user.role === "SUPER_ADMIN"),
	});
};

export const useCircuitBreakerStatus = (
	options?: UseQueryOptions<
		unknown,
		ErrorResponseType,
		GetCircuitBreakerResponseType
	>,
) => {
	const { data: user } = useCurrentUser();

	return useQuery({
		...options,
		queryFn: getCircuitBreakerStatus,
		queryKey: ["circuitBreakerStatus", user?.user.id],
		enabled: Boolean(user?.user.id && user?.user.role === "SUPER_ADMIN"),
		refetchInterval: 30000, // Refetch every 30 seconds
	});
};
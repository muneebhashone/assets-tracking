import { apiAxios } from "@/utils/api.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SuccessResponseType } from "./types.common";
import type { RetryMutationInput, RetryResponse } from "@/types/services/monitoring.types";

// Response Types
export interface RetryMutationResponseType
	extends Omit<SuccessResponseType, "data"> {
	data: RetryResponse;
}

// Service Functions
export const retrySync = async (input: RetryMutationInput) => {
	const { data } = await apiAxios.post<RetryMutationResponseType>(
		`/monitoring/retry-sync/${input.id}`,
	);
	return data;
};

// React Query Mutations
export const useRetrySync = (options?: {
	onSuccess?: (data: RetryMutationResponseType) => void;
	onError?: (error: any) => void;
}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: retrySync,
		onSuccess: (data) => {
			// Invalidate related queries to refresh data
			queryClient.invalidateQueries({ queryKey: ["failedSyncs"] });
			queryClient.invalidateQueries({ queryKey: ["syncHealth"] });
			queryClient.invalidateQueries({ queryKey: ["syncStats"] });
			
			if (options?.onSuccess) {
				options.onSuccess(data);
			}
		},
		onError: options?.onError,
	});
};
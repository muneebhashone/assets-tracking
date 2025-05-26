export type SyncHealthStatus = "healthy" | "warning" | "critical";

export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface SyncHealthData {
	totalActive: number;
	recentFailures: number;
	avgResponseTime: number;
	successRate: number;
	status: SyncHealthStatus;
	lastUpdated: string;
}

export interface SyncHistoryItem {
	id: number;
	shipmentId: number;
	success: boolean;
	error: string | null;
	timestamp: string;
	attemptNumber: number;
	apiResponseTime: number;
}

export interface FailedSync {
	shipmentId: number;
	carrier: string;
	trackingNumber: string;
	lastSyncAttempt: string;
	failureCount: number;
	recentErrors: string[];
}

export interface RetryResponse {
	success: boolean;
	message: string;
	jobId?: string;
}

export interface DailyStats {
	date: string;
	attempts: number;
	successes: number;
	failures: number;
	avgResponseTime: number;
}

export interface FailureReason {
	error: string;
	count: number;
}

export interface SyncStatistics {
	dailyStats: DailyStats[];
	topFailureReasons: FailureReason[];
}

export interface CircuitBreakerStatus {
	state: CircuitBreakerState;
	failureCount: number;
	timestamp: string;
}

// API Input Types
export interface GetSyncHistoryInput {
	id: number;
	limit?: number;
}

export interface GetFailedSyncsInput {
	hours?: number;
	threshold?: number;
}

export interface RetryMutationInput {
	id: number;
}

export interface GetSyncStatsInput {
	days?: number;
}

// Paginated types
export interface PaginatedSyncHistory {
	data: SyncHistoryItem[];
	meta: {
		total: number;
		page: number;
		limit: number;
	};
}
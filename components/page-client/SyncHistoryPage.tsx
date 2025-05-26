"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSyncHistory } from "@/services/monitoring.queries";
import { SyncHistoryTable } from "@/components/tables/monitoring-table/sync-history-table";
import { useState } from "react";
import { History, RefreshCw, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RetrySyncButton } from "@/components/monitoring/retry-sync-button";
import { useCurrentUser } from "@/services/auth.mutations";

interface SyncHistoryPageProps {
	shipmentId: number;
}

const SyncHistoryPage = ({ shipmentId }: SyncHistoryPageProps) => {
	const [limitFilter, setLimitFilter] = useState("50");
	const { data: currentUser } = useCurrentUser();
	const isSuperAdmin = currentUser?.user.role === "SUPER_ADMIN";

	const {
		data: syncHistoryData,
		isLoading,
		refetch,
	} = useSyncHistory({
		id: shipmentId,
		limit: Number(limitFilter),
	});

	// Calculate statistics
	const totalAttempts = syncHistoryData?.data?.length || 0;
	const successfulAttempts = syncHistoryData?.data?.filter(item => item.success).length || 0;
	const failedAttempts = totalAttempts - successfulAttempts;
	const successRate = totalAttempts > 0 ? ((successfulAttempts / totalAttempts) * 100).toFixed(1) : 0;
	const latestAttempt = syncHistoryData?.data?.[0];
	const averageResponseTime = syncHistoryData?.data?.length ? 
		(syncHistoryData.data.reduce((sum, item) => sum + item.apiResponseTime, 0) / syncHistoryData.data.length).toFixed(0) : 0;

	return (
		<div className="p-4 space-y-6 w-full">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-4">
					<Link href="/dashboard/monitoring">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Monitoring
						</Button>
					</Link>
					<div>
						<h1 className="text-2xl font-bold flex items-center gap-2">
							<History className="h-6 w-6" />
							Sync History - Shipment #{shipmentId}
						</h1>
						<p className="text-muted-foreground">
							Detailed sync attempt history for this shipment
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					<Link href={`/dashboard/shipment/${shipmentId}`}>
						<Button variant="outline" size="sm">
							<ExternalLink className="h-4 w-4 mr-2" />
							View Shipment
						</Button>
					</Link>
					{isSuperAdmin && (
						<RetrySyncButton shipmentId={shipmentId} />
					)}
					<Button onClick={() => refetch()} variant="outline">
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalAttempts}</div>
						<p className="text-xs text-muted-foreground">
							Sync attempts recorded
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Success Rate</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{successRate}%</div>
						<p className="text-xs text-muted-foreground">
							{successfulAttempts} successful, {failedAttempts} failed
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Latest Status</CardTitle>
					</CardHeader>
					<CardContent>
						{latestAttempt ? (
							<>
								<Badge 
									className={`${latestAttempt.success 
										? "bg-green-500 hover:bg-green-600" 
										: "bg-red-500 hover:bg-red-600"} text-white mb-2`}
								>
									{latestAttempt.success ? "Success" : "Failed"}
								</Badge>
								<p className="text-xs text-muted-foreground">
									Attempt #{latestAttempt.attemptNumber}
								</p>
							</>
						) : (
							<div className="text-muted-foreground">No data</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{averageResponseTime}ms</div>
						<p className="text-xs text-muted-foreground">
							Average API response time
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Display Options</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-4 items-center">
						<div className="space-y-2">
							<label className="text-sm font-medium">Records to show</label>
							<Select
								value={limitFilter}
								onValueChange={(value) => setLimitFilter(value)}
							>
								<SelectTrigger className="w-[150px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="20">Last 20</SelectItem>
									<SelectItem value="50">Last 50</SelectItem>
									<SelectItem value="100">Last 100</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="text-sm text-muted-foreground">
							Showing the most recent sync attempts first
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Sync History Table */}
			<SyncHistoryTable
				data={syncHistoryData?.data || []}
				shipmentId={shipmentId}
				isLoading={isLoading}
			/>

			{syncHistoryData?.data && syncHistoryData.data.length === 0 && !isLoading && (
				<div className="text-center py-12">
					<History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-medium mb-2">No sync history found</h3>
					<p className="text-muted-foreground mb-4">
						This shipment has no recorded sync attempts yet.
					</p>
					{isSuperAdmin && (
						<RetrySyncButton shipmentId={shipmentId} />
					)}
				</div>
			)}
		</div>
	);
};

export default SyncHistoryPage;
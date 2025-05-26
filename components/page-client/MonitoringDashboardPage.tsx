"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useSyncHealth,
	useSyncStats,
	useCircuitBreakerStatus,
	useFailedSyncs,
} from "@/services/monitoring.queries";
import { HealthStatusCard } from "@/components/monitoring/health-status-card";
import { CircuitBreakerStatusCard } from "@/components/monitoring/circuit-breaker-status";
import { StatsCharts } from "@/components/monitoring/stats-charts";
import { FailedSyncsTable } from "@/components/tables/monitoring-table/failed-syncs-table";
import { useState } from "react";
import { Activity, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

const MonitoringDashboardPage = () => {
	const [statsTimeRange, setStatsTimeRange] = useState("7");
	const [failedSyncsHours, setFailedSyncsHours] = useState("24");

	const {
		data: healthData,
		isLoading: healthLoading,
		refetch: refetchHealth,
	} = useSyncHealth();

	const {
		data: statsData,
		isLoading: statsLoading,
		refetch: refetchStats,
	} = useSyncStats({ days: Number(statsTimeRange) });

	const {
		data: circuitBreakerData,
		isLoading: circuitBreakerLoading,
		refetch: refetchCircuitBreaker,
	} = useCircuitBreakerStatus();

	const {
		data: failedSyncsData,
		isLoading: failedSyncsLoading,
		refetch: refetchFailedSyncs,
	} = useFailedSyncs({ hours: Number(failedSyncsHours) });

	const handleRefreshAll = () => {
		refetchHealth();
		refetchStats();
		refetchCircuitBreaker();
		refetchFailedSyncs();
	};

	return (
		<div className="p-4 space-y-6 w-full">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<Activity className="h-6 w-6" />
						System Monitoring
					</h1>
					<p className="text-muted-foreground">
						Monitor sync health, performance, and troubleshoot issues
					</p>
				</div>
				<Button onClick={handleRefreshAll} variant="outline">
					<RefreshCw className="h-4 w-4 mr-2" />
					Refresh All
				</Button>
			</div>

			{/* Health Status Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<HealthStatusCard
					data={healthData?.data}
					isLoading={healthLoading}
				/>
				<CircuitBreakerStatusCard
					data={circuitBreakerData?.data}
					isLoading={circuitBreakerLoading}
				/>
			</div>

			{/* Statistics Section */}
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold">Performance Statistics</h2>
					<Select
						value={statsTimeRange}
						onValueChange={(value) => setStatsTimeRange(value)}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select time range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">Last 24 hours</SelectItem>
							<SelectItem value="3">Last 3 days</SelectItem>
							<SelectItem value="7">Last 7 days</SelectItem>
							<SelectItem value="14">Last 14 days</SelectItem>
							<SelectItem value="30">Last 30 days</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<StatsCharts
					data={statsData?.data}
					isLoading={statsLoading}
				/>
			</div>

			{/* Failed Syncs Section */}
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold flex items-center gap-2">
						<AlertTriangle className="h-5 w-5" />
						Failed Syncs Overview
					</h2>
					<div className="flex gap-2">
						<Select
							value={failedSyncsHours}
							onValueChange={(value) => setFailedSyncsHours(value)}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select time range" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">Last hour</SelectItem>
								<SelectItem value="6">Last 6 hours</SelectItem>
								<SelectItem value="24">Last 24 hours</SelectItem>
								<SelectItem value="72">Last 3 days</SelectItem>
								<SelectItem value="168">Last week</SelectItem>
							</SelectContent>
						</Select>
						<Link href="/dashboard/monitoring/failed-syncs">
							<Button variant="outline">View All Failed Syncs</Button>
						</Link>
					</div>
				</div>

				<FailedSyncsTable
					data={failedSyncsData?.data?.slice(0, 10) || []}
					isLoading={failedSyncsLoading}
				/>

				{failedSyncsData?.data && failedSyncsData.data.length > 10 && (
					<div className="text-center">
						<Link href="/dashboard/monitoring/failed-syncs">
							<Button variant="outline">
								View All {failedSyncsData.data.length} Failed Syncs
							</Button>
						</Link>
					</div>
				)}
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Link href="/dashboard/monitoring/failed-syncs">
							<Button variant="outline" className="w-full justify-start">
								<AlertTriangle className="h-4 w-4 mr-2" />
								Manage Failed Syncs
							</Button>
						</Link>
						<Button
							variant="outline"
							className="w-full justify-start"
							onClick={() => refetchHealth()}
						>
							<RefreshCw className="h-4 w-4 mr-2" />
							Refresh Health Status
						</Button>
						<Button
							variant="outline"
							className="w-full justify-start"
							onClick={() => refetchStats()}
						>
							<Activity className="h-4 w-4 mr-2" />
							Update Statistics
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default MonitoringDashboardPage;
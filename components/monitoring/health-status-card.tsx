import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SyncHealthData } from "@/types/services/monitoring.types";
import { AlertCircle, CheckCircle2, Clock, Activity } from "lucide-react";
import { format } from "date-fns";

interface HealthStatusCardProps {
	data: SyncHealthData;
	isLoading?: boolean;
}

const getStatusIcon = (status: SyncHealthData["status"]) => {
	switch (status) {
		case "healthy":
			return <CheckCircle2 className="h-5 w-5 text-green-600" />;
		case "warning":
			return <AlertCircle className="h-5 w-5 text-yellow-600" />;
		case "critical":
			return <AlertCircle className="h-5 w-5 text-red-600" />;
		default:
			return <Activity className="h-5 w-5 text-gray-600" />;
	}
};

const getStatusColor = (status: SyncHealthData["status"]) => {
	switch (status) {
		case "healthy":
			return "bg-green-500 hover:bg-green-600";
		case "warning":
			return "bg-yellow-500 hover:bg-yellow-600";
		case "critical":
			return "bg-red-500 hover:bg-red-600";
		default:
			return "bg-gray-500 hover:bg-gray-600";
	}
};

export function HealthStatusCard({ data, isLoading }: HealthStatusCardProps) {
	if (isLoading) {
		return (
			<Card className="h-full">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Sync Health Status</CardTitle>
					<div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="h-6 bg-gray-200 rounded animate-pulse" />
						<div className="grid grid-cols-2 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="space-y-1">
									<div className="h-4 bg-gray-200 rounded animate-pulse" />
									<div className="h-6 bg-gray-200 rounded animate-pulse" />
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="h-full">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Sync Health Status</CardTitle>
				{getStatusIcon(data.status)}
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Badge className={`${getStatusColor(data.status)} text-white`}>
							{data.status.toUpperCase()}
						</Badge>
						<span className="text-lg font-bold">
							{data.successRate.toFixed(1)}% Success Rate
						</span>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">Active Syncs</p>
							<p className="text-2xl font-bold">{data.totalActive}</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">Recent Failures</p>
							<p className="text-2xl font-bold text-red-600">
								{data.recentFailures}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">Avg Response</p>
							<p className="text-2xl font-bold">{data.avgResponseTime}ms</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">Last Updated</p>
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3 text-muted-foreground" />
								<p className="text-xs">
									{format(new Date(data.lastUpdated), "HH:mm:ss")}
								</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
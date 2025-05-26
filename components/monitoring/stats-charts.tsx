import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SyncStatistics } from "@/types/services/monitoring.types";
import { LineChart } from "@/components/LineChart";
import { BarChart } from "@/components/BarChart";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface StatsChartsProps {
	data: SyncStatistics;
	isLoading?: boolean;
}

export function StatsCharts({ data, isLoading }: StatsChartsProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Daily Sync Trends</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-64 bg-gray-200 rounded animate-pulse" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Top Failure Reasons</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-64 bg-gray-200 rounded animate-pulse" />
					</CardContent>
				</Card>
			</div>
		);
	}

	const lineChartData = data.dailyStats.map((stat) => ({
		date: stat.date,
		successes: stat.successes,
		failures: stat.failures,
		total: stat.attempts,
	}));

	const barChartData = data.topFailureReasons.map((reason) => ({
		name: reason.error.length > 20 
			? `${reason.error.substring(0, 20)}...` 
			: reason.error,
		count: reason.count,
		fullName: reason.error,
	}));

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-base font-medium">Daily Sync Trends</CardTitle>
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="h-64">
						<LineChart
							data={lineChartData}
							xDataKey="date"
							lines={[
								{
									dataKey: "successes",
									stroke: "#22c55e",
									name: "Successes",
								},
								{
									dataKey: "failures",
									stroke: "#ef4444",
									name: "Failures",
								},
								{
									dataKey: "total",
									stroke: "#3b82f6",
									name: "Total Attempts",
								},
							]}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-base font-medium">Top Failure Reasons</CardTitle>
					<AlertTriangle className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="h-64">
						{barChartData.length > 0 ? (
							<BarChart
								data={barChartData}
								xDataKey="name"
								yDataKey="count"
								color="#ef4444"
							/>
						) : (
							<div className="flex items-center justify-center h-full text-muted-foreground">
								No failure data available
							</div>
						)}
					</div>
					{barChartData.length > 0 && (
						<div className="mt-4 space-y-2">
							<h4 className="text-sm font-medium">Full Error Messages:</h4>
							<div className="space-y-1">
								{data.topFailureReasons.slice(0, 3).map((reason, index) => (
									<div
										key={index}
										className="text-xs text-muted-foreground flex justify-between"
									>
										<span className="truncate max-w-[200px]" title={reason.error}>
											{reason.error}
										</span>
										<span className="font-medium">{reason.count}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CircuitBreakerStatus } from "@/types/services/monitoring.types";
import { Shield, ShieldAlert, ShieldCheck, Clock } from "lucide-react";
import { format } from "date-fns";

interface CircuitBreakerStatusProps {
	data: CircuitBreakerStatus;
	isLoading?: boolean;
}

const getStateIcon = (state: CircuitBreakerStatus["state"]) => {
	switch (state) {
		case "CLOSED":
			return <ShieldCheck className="h-5 w-5 text-green-600" />;
		case "OPEN":
			return <ShieldAlert className="h-5 w-5 text-red-600" />;
		case "HALF_OPEN":
			return <Shield className="h-5 w-5 text-yellow-600" />;
		default:
			return <Shield className="h-5 w-5 text-gray-600" />;
	}
};

const getStateColor = (state: CircuitBreakerStatus["state"]) => {
	switch (state) {
		case "CLOSED":
			return "bg-green-500 hover:bg-green-600";
		case "OPEN":
			return "bg-red-500 hover:bg-red-600";
		case "HALF_OPEN":
			return "bg-yellow-500 hover:bg-yellow-600";
		default:
			return "bg-gray-500 hover:bg-gray-600";
	}
};

const getStateDescription = (state: CircuitBreakerStatus["state"]) => {
	switch (state) {
		case "CLOSED":
			return "Normal operation, requests allowed";
		case "OPEN":
			return "Circuit breaker triggered, requests blocked";
		case "HALF_OPEN":
			return "Testing if service has recovered";
		default:
			return "Unknown state";
	}
};

export function CircuitBreakerStatusCard({
	data,
	isLoading,
}: CircuitBreakerStatusProps) {
	if (isLoading) {
		return (
			<Card className="h-full">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Circuit Breaker</CardTitle>
					<div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="h-6 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 bg-gray-200 rounded animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 bg-gray-200 rounded animate-pulse" />
							<div className="h-6 bg-gray-200 rounded animate-pulse" />
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="h-full">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Circuit Breaker</CardTitle>
				{getStateIcon(data.state)}
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Badge className={`${getStateColor(data.state)} text-white`}>
							{data.state.replace("_", " ")}
						</Badge>
					</div>

					<p className="text-sm text-muted-foreground">
						{getStateDescription(data.state)}
					</p>

					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">
								Failure Count
							</span>
							<span className="text-lg font-bold">{data.failureCount}</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">Last Update</span>
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3 text-muted-foreground" />
								<span className="text-xs">
									{format(new Date(data.timestamp), "MMM dd, HH:mm:ss")}
								</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
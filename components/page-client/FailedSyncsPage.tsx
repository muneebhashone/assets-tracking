"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useFailedSyncs } from "@/services/monitoring.queries";
import { FailedSyncsTable } from "@/components/tables/monitoring-table/failed-syncs-table";
import { useState, useMemo } from "react";
import { AlertTriangle, Search, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FailedSyncsPage = () => {
	const [hoursFilter, setHoursFilter] = useState("24");
	const [thresholdFilter, setThresholdFilter] = useState("3");
	const [searchTerm, setSearchTerm] = useState("");
	const [carrierFilter, setCarrierFilter] = useState("");

	const {
		data: failedSyncsData,
		isLoading,
		refetch,
	} = useFailedSyncs({
		hours: Number(hoursFilter),
		threshold: Number(thresholdFilter),
	});

	// Filter data based on search and carrier filter
	const filteredData = useMemo(() => {
		if (!failedSyncsData?.data) return [];

		return failedSyncsData.data.filter((sync) => {
			const matchesSearch = searchTerm === "" || 
				sync.shipmentId.toString().includes(searchTerm) ||
				sync.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
				sync.recentErrors.some(error => 
					error.toLowerCase().includes(searchTerm.toLowerCase())
				);

			const matchesCarrier = carrierFilter === "" || 
				sync.carrier === carrierFilter;

			return matchesSearch && matchesCarrier;
		});
	}, [failedSyncsData?.data, searchTerm, carrierFilter]);

	// Get unique carriers for filter
	const availableCarriers = useMemo(() => {
		if (!failedSyncsData?.data) return [];
		const carriers = [...new Set(failedSyncsData.data.map(sync => sync.carrier))];
		return carriers.sort();
	}, [failedSyncsData?.data]);

	// Statistics
	const totalFailures = failedSyncsData?.data?.length || 0;
	const highPriorityFailures = failedSyncsData?.data?.filter(sync => sync.failureCount >= 10).length || 0;
	const averageFailureCount = failedSyncsData?.data?.length ? 
		(failedSyncsData.data.reduce((sum, sync) => sum + sync.failureCount, 0) / failedSyncsData.data.length).toFixed(1) : 0;

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
							<AlertTriangle className="h-6 w-6 text-red-600" />
							Failed Syncs Management
						</h1>
						<p className="text-muted-foreground">
							View and manage shipments that failed to sync
						</p>
					</div>
				</div>
				<Button onClick={() => refetch()} variant="outline">
					<RefreshCw className="h-4 w-4 mr-2" />
					Refresh
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total Failed Syncs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{totalFailures}</div>
						<p className="text-xs text-muted-foreground">
							In the last {hoursFilter} hours
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">High Priority</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">{highPriorityFailures}</div>
						<p className="text-xs text-muted-foreground">
							10+ failures
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Average Failures</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{averageFailureCount}</div>
						<p className="text-xs text-muted-foreground">
							Per shipment
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Time Range</label>
							<Select
								value={hoursFilter}
								onValueChange={(value) => setHoursFilter(value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">Last hour</SelectItem>
									<SelectItem value="6">Last 6 hours</SelectItem>
									<SelectItem value="24">Last 24 hours</SelectItem>
									<SelectItem value="72">Last 3 days</SelectItem>
									<SelectItem value="168">Last week</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Failure Threshold</label>
							<Select
								value={thresholdFilter}
								onValueChange={(value) => setThresholdFilter(value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">1+ failures</SelectItem>
									<SelectItem value="3">3+ failures</SelectItem>
									<SelectItem value="5">5+ failures</SelectItem>
									<SelectItem value="10">10+ failures</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Carrier</label>
							<Select
								value={carrierFilter}
								onValueChange={(value) => setCarrierFilter(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="All carriers" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">All carriers</SelectItem>
									{availableCarriers.map((carrier) => (
										<SelectItem key={carrier} value={carrier}>
											{carrier}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2 md:col-span-2">
							<label className="text-sm font-medium">Search</label>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search by shipment ID, tracking number, or error..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-8"
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Results Summary */}
			{filteredData.length !== totalFailures && (
				<div className="text-sm text-muted-foreground">
					Showing {filteredData.length} of {totalFailures} failed syncs
				</div>
			)}

			{/* Failed Syncs Table */}
			<FailedSyncsTable
				data={filteredData}
				isLoading={isLoading}
			/>

			{filteredData.length === 0 && !isLoading && (
				<div className="text-center py-12">
					<AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-medium mb-2">No failed syncs found</h3>
					<p className="text-muted-foreground mb-4">
						{searchTerm || carrierFilter
							? "Try adjusting your filters or search criteria."
							: "Great! No shipments are currently failing to sync."}
					</p>
					{(searchTerm || carrierFilter) && (
						<Button
							variant="outline"
							onClick={() => {
								setSearchTerm("");
								setCarrierFilter("");
							}}
						>
							Clear Filters
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

export default FailedSyncsPage;
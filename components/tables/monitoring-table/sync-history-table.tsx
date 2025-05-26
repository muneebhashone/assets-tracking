"use client";

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	type SortingState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { syncHistoryColumns } from "./sync-history-columns";
import type { SyncHistoryItem } from "@/types/services/monitoring.types";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface SyncHistoryTableProps {
	data: SyncHistoryItem[];
	shipmentId: number;
	isLoading?: boolean;
}

export function SyncHistoryTable({ 
	data, 
	shipmentId, 
	isLoading 
}: SyncHistoryTableProps) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "timestamp", desc: true }
	]);

	const table = useReactTable({
		data,
		columns: syncHistoryColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	});

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<History className="h-5 w-5" />
						Sync History - Shipment #{shipmentId}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<History className="h-5 w-5" />
					Sync History - Shipment #{shipmentId} ({data.length} records)
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead 
											key={header.id}
											className="cursor-pointer select-none"
											onClick={header.column.getToggleSortingHandler()}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
											{header.column.getIsSorted() && (
												<span className="ml-1">
													{header.column.getIsSorted() === "desc" ? "↓" : "↑"}
												</span>
											)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={syncHistoryColumns.length}
										className="h-24 text-center"
									>
										No sync history found for this shipment.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
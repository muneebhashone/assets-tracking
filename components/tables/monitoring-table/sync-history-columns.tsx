"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { SyncHistoryItem } from "@/types/services/monitoring.types";
import { format } from "date-fns";

export const syncHistoryColumns: ColumnDef<SyncHistoryItem>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => <div>{row.getValue("id")}</div>,
	},
	{
		accessorKey: "success",
		header: "Status",
		cell: ({ row }) => {
			const success = row.getValue("success") as boolean;
			return (
				<div className="flex items-center gap-1">
					{success ? (
						<>
							<CheckCircle2 className="h-4 w-4 text-green-600" />
							<Badge className="bg-green-500 hover:bg-green-600 text-white">
								Success
							</Badge>
						</>
					) : (
						<>
							<XCircle className="h-4 w-4 text-red-600" />
							<Badge className="bg-red-500 hover:bg-red-600 text-white">
								Failed
							</Badge>
						</>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "attemptNumber",
		header: "Attempt #",
		cell: ({ row }) => (
			<div className="font-medium">{row.getValue("attemptNumber")}</div>
		),
	},
	{
		accessorKey: "apiResponseTime",
		header: "Response Time",
		cell: ({ row }) => {
			const responseTime = row.getValue("apiResponseTime") as number;
			const colorClass = responseTime > 5000 
				? "text-red-600" 
				: responseTime > 2000 
				? "text-yellow-600" 
				: "text-green-600";
			
			return (
				<div className={`font-mono ${colorClass}`}>
					{responseTime.toLocaleString()}ms
				</div>
			);
		},
	},
	{
		accessorKey: "timestamp",
		header: "Timestamp",
		cell: ({ row }) => {
			const date = row.getValue("timestamp") as string;
			return (
				<div className="flex items-center gap-1">
					<Clock className="h-3 w-3 text-muted-foreground" />
					<div className="text-sm">
						{format(new Date(date), "MMM dd, yyyy HH:mm:ss")}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "error",
		header: "Error Details",
		cell: ({ row }) => {
			const error = row.getValue("error") as string | null;
			if (!error) {
				return <span className="text-muted-foreground">-</span>;
			}
			
			return (
				<div 
					className="max-w-[250px] text-xs text-red-600 truncate cursor-help" 
					title={error}
				>
					{error}
				</div>
			);
		},
	},
];
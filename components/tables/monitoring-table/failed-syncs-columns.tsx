"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { FailedSync } from "@/types/services/monitoring.types";
import { format } from "date-fns";
import { RetrySyncButton } from "@/components/monitoring/retry-sync-button";
import { useCurrentUser } from "@/services/auth.mutations";

// Cell component for actions column to properly use React hooks
interface ActionsCellProps {
	failedSync: FailedSync;
}

const ActionsCell = ({ failedSync }: ActionsCellProps) => {
	const { data: currentUser } = useCurrentUser();
	const isSuperAdmin = currentUser?.user.role === "SUPER_ADMIN";

	return (
		<div className="flex justify-end gap-1">
			<Link href={`/dashboard/monitoring/sync-history/${failedSync.shipmentId}`}>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0"
					title="View sync history"
				>
					<ExternalLinkIcon className="h-4 w-4" />
				</Button>
			</Link>
			{isSuperAdmin && (
				<RetrySyncButton
					shipmentId={failedSync.shipmentId}
					size="sm"
					variant="ghost"
					showText={false}
				/>
			)}
		</div>
	);
};

export const failedSyncsColumns: ColumnDef<FailedSync>[] = [
	{
		accessorKey: "shipmentId",
		header: "Shipment ID",
		cell: ({ row }) => (
			<div className="font-medium">{row.getValue("shipmentId")}</div>
		),
	},
	{
		accessorKey: "carrier",
		header: "Carrier",
		cell: ({ row }) => (
			<Badge variant="outline">{row.getValue("carrier")}</Badge>
		),
	},
	{
		accessorKey: "trackingNumber",
		header: "Tracking Number",
		cell: ({ row }) => (
			<div className="font-mono text-sm">{row.getValue("trackingNumber")}</div>
		),
	},
	{
		accessorKey: "failureCount",
		header: "Failures",
		cell: ({ row }) => {
			const count = row.getValue("failureCount") as number;
			const colorClass = count >= 10 ? "text-red-600" : count >= 5 ? "text-yellow-600" : "text-blue-600";
			return (
				<div className={`font-bold ${colorClass}`}>{count}</div>
			);
		},
	},
	{
		accessorKey: "lastSyncAttempt",
		header: "Last Attempt",
		cell: ({ row }) => {
			const date = row.getValue("lastSyncAttempt") as string;
			return (
				<div className="text-sm">
					{format(new Date(date), "MMM dd, HH:mm")}
				</div>
			);
		},
	},
	{
		accessorKey: "recentErrors",
		header: "Recent Errors",
		cell: ({ row }) => {
			const errors = row.getValue("recentErrors") as string[];
			if (!errors || errors.length === 0) return "-";
			
			const latestError = errors[0];
			const remainingCount = errors.length - 1;
			
			return (
				<div className="max-w-[200px]">
					<div className="text-xs text-red-600 truncate" title={latestError}>
						{latestError}
					</div>
					{remainingCount > 0 && (
						<div className="text-xs text-muted-foreground">
							+{remainingCount} more
						</div>
					)}
				</div>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => <ActionsCell failedSync={row.original} />,
	},
];
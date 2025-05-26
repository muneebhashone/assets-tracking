import SyncHistoryPage from "@/components/page-client/SyncHistoryPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Fratezone - Sync History",
	description: "View shipment sync history details",
};

interface SyncHistoryPageRouteProps {
	params: {
		shipmentId: string;
	};
}

const SyncHistoryPageRoute = PermissionWrapper(
	({ params }: SyncHistoryPageRouteProps) => {
		return <SyncHistoryPage shipmentId={Number(params.shipmentId)} />;
	},
);

export default SyncHistoryPageRoute;
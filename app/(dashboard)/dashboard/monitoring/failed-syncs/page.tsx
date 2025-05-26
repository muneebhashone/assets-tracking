import FailedSyncsPage from "@/components/page-client/FailedSyncsPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Fratezone - Failed Syncs",
	description: "View and manage failed shipment syncs",
};

const FailedSyncsPageRoute = PermissionWrapper(() => {
	return <FailedSyncsPage />;
});

export default FailedSyncsPageRoute;
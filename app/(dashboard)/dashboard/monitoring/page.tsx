import MonitoringDashboardPage from "@/components/page-client/MonitoringDashboardPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Fratezone - Monitoring",
	description: "System monitoring and sync health dashboard",
};

const MonitoringPage = PermissionWrapper(() => {
	return <MonitoringDashboardPage />;
});

export default MonitoringPage;
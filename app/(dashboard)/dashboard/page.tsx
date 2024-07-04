import DashboardPage from "@/components/page-client/DashboardPage";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import React from "react";

const Page = () => {
  return <DashboardPage />;
};

export default RoleWrapper(Page, "VIEW_DASHBOARD");

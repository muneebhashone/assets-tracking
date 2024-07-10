import DashboardPage from "@/components/page-client/DashboardPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";

import React from "react";

const Page = () => {
  return <DashboardPage />;
};

export default PermissionWrapper(Page, "VIEW_DASHBOARD");

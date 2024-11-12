import RequestedUserPage from "@/components/page-client/RequestedUserPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "Fratezone - Requested Users",
  description: "View your requested users",
};

const Page = () => {
  return <RequestedUserPage />;
};

export default PermissionWrapper(Page, "VIEW_SHIPMENT");

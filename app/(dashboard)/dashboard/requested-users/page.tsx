import RequestedUserPage from "@/components/page-client/RequestedUserPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";

import React from "react";

const Page = () => {
  return <RequestedUserPage />;
};

export default PermissionWrapper(Page, "VIEW_SHIPMENT");

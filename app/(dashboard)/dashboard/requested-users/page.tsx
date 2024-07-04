import RequestedUserPage from "@/components/page-client/RequestedUserPage";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import React from "react";

const Page = () => {
  return <RequestedUserPage />;
};

export default RoleWrapper(Page, "VIEW_SHIPMENT");

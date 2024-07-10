import AssignsPage from "@/components/page-client/AssignsPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import React from "react";

const Page = () => {
  return <AssignsPage />;
};

export default PermissionWrapper(Page);

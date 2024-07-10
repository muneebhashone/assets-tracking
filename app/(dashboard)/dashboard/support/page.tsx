import AssignsPage from "@/components/page-client/AssignsPage";
import SupportPage from "@/components/page-client/SupportPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import React from "react";

const Page = () => {
  return <SupportPage />;
};

export default PermissionWrapper(Page);

import AssignsPage from "@/components/page-client/AssignsPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fratezone - Assigns",
  description: "Manage your assigns",
};

const Page = () => {
  return <AssignsPage />;
};

export default PermissionWrapper(Page);

import UsersPage from "@/components/page-client/UsersPage";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import React from "react";

const Page = () => {
  return <UsersPage />;
};

export default RoleWrapper(Page, "VIEW_USER");

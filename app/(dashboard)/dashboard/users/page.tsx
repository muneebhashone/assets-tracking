import UsersPage from "@/components/page-client/UsersPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fratezone - Users",
  description: "Manage your users",
};

const Page = () => {
  return <UsersPage />;
};

export default PermissionWrapper(Page, "VIEW_USER");

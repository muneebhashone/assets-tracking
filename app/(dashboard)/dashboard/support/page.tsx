import SupportPage from "@/components/page-client/SupportPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fratezone - Support",
  description: "Manage your support",
};

const Page = () => {
  return <SupportPage />;
};

export default PermissionWrapper(Page);

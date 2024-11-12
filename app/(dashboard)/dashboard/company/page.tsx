import CompanyPage from "@/components/page-client/CompanyPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fratezone - Company",
  description: "Manage your company",
};

const Page = async () => {
  return <CompanyPage />;
};

export default PermissionWrapper(Page, "VIEW_COMPANY");

import CompanyPage from "@/components/page-client/CompanyPage";
import RoleWrapper from "@/components/wrapper/role-wrapper";

const Page = async () => {
  return <CompanyPage />;
};

export default RoleWrapper(Page, "VIEW_COMPANY");

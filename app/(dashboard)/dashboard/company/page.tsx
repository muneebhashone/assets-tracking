import CompanyPage from "@/components/page-client/CompanyPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";


const Page = async () => {
  return <CompanyPage />;
};

export default PermissionWrapper(Page, "VIEW_COMPANY");

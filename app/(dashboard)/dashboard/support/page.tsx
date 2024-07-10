import SupportPage from "@/components/page-client/SupportPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";

const Page = () => {
  return <SupportPage />;
};

export default PermissionWrapper(Page);

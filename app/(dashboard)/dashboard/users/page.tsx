import UsersPage from "@/components/page-client/UsersPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";

const Page = () => {
  return <UsersPage />;
};

export default PermissionWrapper(Page, "VIEW_USER");

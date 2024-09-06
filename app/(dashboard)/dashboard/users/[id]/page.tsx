import UserDetailPage from "@/components/page-client/UserDetailPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";

interface PageProps {
  params: {
    [key: string]: string | undefined;
  };
}
const UserDetails = ({ params }: PageProps) => {
  const { id } = params;
  return <UserDetailPage id={id as string} />;
};

export default PermissionWrapper(UserDetails, "VIEW_USER");

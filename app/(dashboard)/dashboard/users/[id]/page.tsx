import UserDetailPage from "@/components/page-client/UserDetailPage";

interface PageProps {
  params: {
    [key: string]: string | undefined;
  };
}
const UserDetails = ({ params }: PageProps) => {
  const { id } = params;
  return <UserDetailPage id={id as string} />;
};

export default UserDetails;

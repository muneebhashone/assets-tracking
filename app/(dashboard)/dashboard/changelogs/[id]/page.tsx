import ChangelogDetailPage from "@/components/page-client/ChangelogDetailPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";

interface PageProps {
  params: {
    [key: string]: string | undefined;
  };
}

const ChangelogDetails = (props: PageProps) => {
  const { params } = props;
  if (params.id) {
    return <ChangelogDetailPage id={params.id} />;
  }
  return null;
};

export default PermissionWrapper(ChangelogDetails, "VIEW_DASHBOARD");

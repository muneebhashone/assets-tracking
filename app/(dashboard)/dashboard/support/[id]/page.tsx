import SupportDetailPage from "@/components/page-client/SupportDetailPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import React from "react";
interface PageProps {
  params: {
    [key: string]: string | undefined;
  };
}
const page = ({ params }: PageProps) => {

  if (params.id) {
    return <SupportDetailPage id={params.id} />;
  }
  return null;
};

export default PermissionWrapper(page);

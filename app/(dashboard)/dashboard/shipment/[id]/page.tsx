import ShipmentDetailPage from "@/components/page-client/ShipmentDetailPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";

interface PageProps {
  params: {
    [key: string]: string | undefined;
  };
}
const ShipmentDetails = (props: PageProps) => {
  const { params } = props;
  if (params.id) {
    return <ShipmentDetailPage id={params.id} />;
  }
  return null;
};
export default PermissionWrapper(ShipmentDetails, "VIEW_SHIPMENT");

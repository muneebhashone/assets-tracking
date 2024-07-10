import ShipmentPage from "@/components/page-client/ShipmentPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";



const ShipmentList = () => {
  return <ShipmentPage />;
};

export default PermissionWrapper(ShipmentList, "VIEW_SHIPMENT");

import ShipmentPage from "@/components/page-client/ShipmentPage";
import RoleWrapper from "@/components/wrapper/role-wrapper";

const ShipmentList = () => {
  return <ShipmentPage />;
};

export default RoleWrapper(ShipmentList, "VIEW_SHIPMENT");

import ShipmentPage from "@/components/page-client/ShipmentPage";
import PermissionWrapper from "@/components/wrapper/permission-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fratezone - Shipment List",
  description: "View your shipment list",
};

const ShipmentList = () => {
  return <ShipmentPage />;
};

export default PermissionWrapper(ShipmentList, "VIEW_SHIPMENT");

"use client";

import { useGetMovementsByShipmentId } from "@/services/shipment.queries";
import { Movement } from "@/types/services/shipment.types";
import { columns } from "../tables/shipment-movement-table/columns";
import { ShipmentMovementTable } from "../tables/shipment-movement-table/shipment-movement-table";
interface ShipmentMovementProps {
  shipmentId: number;
}
const ShipmentMovement = ({ shipmentId }: ShipmentMovementProps) => {
  const { data, isLoading } = useGetMovementsByShipmentId({ shipmentId });
  return isLoading ? (
    <p>Loading</p>
  ) : (
    <ShipmentMovementTable
      columns={columns}
      data={data?.results as Movement[]}
      pageCount={1}
    />
  );
};

export default ShipmentMovement;

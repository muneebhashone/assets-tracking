"use client";

import { useGetContainersByShipmentId } from "@/services/shipment.queries";
import { columns } from "../tables/shipment-container-table/columns";
import { ShipmentContainerTable } from "../tables/shipment-container-table/shipment-container-table";
import { Container } from "@/types/services/shipment.types";

interface ShipmentContainerProps {
  shipmentId: number;
}

const ShipmentContainer = ({ shipmentId }: ShipmentContainerProps) => {
  const { data, isLoading } = useGetContainersByShipmentId({ shipmentId });
  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <ShipmentContainerTable
      columns={columns}
      data={(data?.results || []) as Container[]}
      pageCount={1}
    />
  );
};

export default ShipmentContainer;

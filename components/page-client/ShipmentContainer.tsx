"use client";

import { containerDemoData } from "@/constants/data";
import { columns } from "../tables/shipment-container-table/columns";
import { ShipmentContainerTable } from "../tables/shipment-container-table/shipment-container-table";

const ShipmentContainer = () => {
  return (
    <ShipmentContainerTable
      columns={columns}
      data={containerDemoData}
      pageCount={1}
    />
  );
};

export default ShipmentContainer;

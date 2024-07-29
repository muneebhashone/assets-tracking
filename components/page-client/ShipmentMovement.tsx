"use client";

import React from "react";
import { ShipmentMovementTable } from "../tables/shipment-movement-table/shipment-movement-table";
import { columns } from "../tables/shipment-movement-table/columns";
import { movementDemoData } from "@/constants/data";

const ShipmentMovement = () => {
  return (
    <ShipmentMovementTable
      columns={columns}
      data={movementDemoData}
      pageCount={1}
    />
  );
};

export default ShipmentMovement;

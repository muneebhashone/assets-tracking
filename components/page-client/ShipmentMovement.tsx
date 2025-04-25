"use client";

import { useGetMovementsByShipmentId } from "@/services/shipment.queries";
import type { Movement } from "@/types/services/shipment.types";
import { columns } from "../tables/shipment-movement-table/columns";
import { ShipmentMovementTable } from "../tables/shipment-movement-table/shipment-movement-table";
import React from "react";

interface ShipmentMovementProps {
  shipmentId: number;
}

const ShipmentMovement = ({ shipmentId }: ShipmentMovementProps) => {
  const { data, isLoading } = useGetMovementsByShipmentId({ shipmentId });

  // Process movements to add streak numbers to duplicate locations
  const processedMovements = React.useMemo(() => {
    if (!data?.results) return [];

    const movements = [...data.results].sort(
      (a, b) =>
        new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime(),
    );

    const result: Movement[] = [];
    const locationCounts: Record<string, number> = {};
    const streaks: Record<string, number> = {};

    let currentLocation = "";

    for (let i = 0; i < movements.length; i++) {
      const movement = movements[i];
      const locationName = movement.location?.name || "";

      // New location
      if (locationName !== currentLocation) {
        // Update location counts
        locationCounts[locationName] = (locationCounts[locationName] || 0) + 1;

        // Reset streak if this location appears again
        if (locationCounts[locationName] > 1) {
          streaks[locationName] = locationCounts[locationName];
        }

        currentLocation = locationName;
      }

      // Create a clone of the movement
      const modifiedMovement = { ...movement };

      // If this location has appeared multiple times, add streak number
      if (streaks[locationName] && streaks[locationName] > 1) {
        modifiedMovement.location = {
          ...modifiedMovement.location,
          name: `(${streaks[locationName]}) ${locationName}`,
        };
      }

      result.push(modifiedMovement);
    }

    return result;
  }, [data?.results]);

  return isLoading ? (
    <p>Loading</p>
  ) : (
    <ShipmentMovementTable
      columns={columns}
      data={processedMovements}
      pageCount={1}
    />
  );
};

export default ShipmentMovement;

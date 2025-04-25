import {
  useGetContainersByShipmentId,
  useGetMovementsByShipmentId,
} from "@/services/shipment.queries";
import type { Movement } from "@/types/services/shipment.types";
import moment from "moment";

export type KPIResult = {
  portToPort: number | null;
  doorToDoor: number | null;
  emptyToShipperToGateOut: number | null;
  emptyToShipperToDelivery: number | null;
  gateOutToEmptyReturn: number | null;
};

export const useShipmentKPIs = (shipmentId: number) => {
  const { data: containersData, isLoading: isLoadingContainers } =
    useGetContainersByShipmentId({ shipmentId });

  const { data: movementsData, isLoading: isLoadingMovements } =
    useGetMovementsByShipmentId({ shipmentId });

  const calculateKPIs = (): KPIResult | null => {
    if (!containersData?.results?.length) return null;

    // We'll calculate across all containers or use the first one based on requirements
    const container = containersData.results[0];

    // Get dates from movements based on descriptions
    const vesselSailingDate = findMovementDate(movementsData?.results || [], [
      "Vessel Sailing",
      "VESSEL SAILING",
      "Vessel Departed",
      "Departure",
    ]);

    const vesselArrivalDate = findMovementDate(
      movementsData?.results || [],
      ["Vessel Arrival", "VESSEL ARRIVAL", "Vessel Arrived", "Arrival"],
      true,
    );

    const deliveryDate = findMovementDate(
      movementsData?.results || [],
      ["Delivery", "DELIVERY", "Final Delivery", "Delivered"],
      true,
    );

    return {
      // Port to Port: Vessel Arrival Date - Vessel Sailing Date + 1 day
      portToPort: calculateDateDiff(vesselSailingDate, vesselArrivalDate),

      // Door to Door: Delivery Date - Empty to Shipper + 1 day
      doorToDoor: calculateDateDiff(container.emptyToShipper, deliveryDate),

      // Empty-to-Shipper to Gate Out: Gate Out - Empty-to-Shipper + 1 day
      emptyToShipperToGateOut: calculateDateDiff(
        container.emptyToShipper,
        container.gateOut,
      ),

      // Empty-to-Shipper to Delivery: Delivery Date - Empty-to-Shipper + 1 day
      emptyToShipperToDelivery: calculateDateDiff(
        container.emptyToShipper,
        deliveryDate,
      ),

      // Gate Out to Empty Return: Empty return - Gate Out + 1 day
      gateOutToEmptyReturn: calculateDateDiff(
        container.gateOut,
        container.emptyReturn,
      ),
    };
  };

  // Helper function to find a date for a specific description in movements
  const findMovementDate = (
    movements: Movement[],
    possibleDescriptions: string[],
    findLast = false,
  ): Date | null => {
    if (!movements?.length) return null;

    // Find movement with matching description

    let matchingMovement = null;

    if (!findLast) {
      matchingMovement = movements.find(
        (movement) =>
          movement.description &&
          possibleDescriptions.some(
            (desc) =>
              movement.description?.toLowerCase().includes(desc.toLowerCase()),
          ),
      );
    } else {
      matchingMovement = movements.findLast(
        (movement) =>
          movement.description &&
          possibleDescriptions.some(
            (desc) =>
              movement.description?.toLowerCase().includes(desc.toLowerCase()),
          ),
      );
    }

    return matchingMovement?.date || null;
  };

  const calculateDateDiff = (
    startDate: Date | null,
    endDate: Date | null,
  ): number | null => {
    if (!startDate || !endDate) return null;

    const start = moment(startDate);
    const end = moment(endDate);

    // Add 1 day to include end date in calculation
    return end.diff(start, "days") + 1;
  };

  return {
    kpis: isLoadingContainers || isLoadingMovements ? null : calculateKPIs(),
    isLoading: isLoadingContainers || isLoadingMovements,
  };
};

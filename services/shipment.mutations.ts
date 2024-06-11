import { apiAxios } from "@/utils/api.utils";
import { Shipment, TrackWithType } from "./shipment.queries";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { ErrorResponseType } from "./types.common";

// export type Email = `${string}@${string}.${string}`;

export interface CreateShipmentInputType {
  trackWith: TrackWithType;
  carrier: string;
  tags: any[];
  followers: string[];
  referenceNo: string | null;
  containerNo: string;
  mblNo: string | null;
}

export interface CreateShipmentResponseType {
  status: string;
  message: string;
  data: Shipment;
}

export const createShipment = async (
  input: CreateShipmentInputType,
): Promise<CreateShipmentResponseType> => {
  const { data } = await apiAxios.post<CreateShipmentResponseType>(
    "/shipments",
    input,
  );

  return data;
};

export const useCreateShipment = (
  options?: UseMutationOptions<
    CreateShipmentResponseType,
    ErrorResponseType,
    CreateShipmentInputType
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: createShipment,
  });
};

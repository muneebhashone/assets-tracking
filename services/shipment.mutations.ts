import { apiAxios } from "@/utils/api.utils";
import { Shipment, TrackWithType, getShipments } from "./shipment.queries";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ErrorResponseType, SuccessResponseType } from "./types.common";

// export type Email = `${string}@${string}.${string}`;
//types
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

export interface DeleteShipmentInputType {
  id: number;
}
export interface DeleteBulkShipmentInputType {
  ids: number[];
}

//services

export const createShipment = async (
  input: CreateShipmentInputType,
): Promise<CreateShipmentResponseType> => {
  const { data } = await apiAxios.post<CreateShipmentResponseType>(
    "/shipments",
    input,
  );

  return data;
};

export const deleteShipment = async (input: DeleteShipmentInputType) => {
  const { id } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(
    `/shipments/${id}`,
  );
  return data;
};

export const deleteBulkShipments = async (
  input: DeleteBulkShipmentInputType,
) => {
  const { ids } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(
    `/shipments/bulk`,
    {
      params: { ids },
    },
  );
  return data;
};

//hooks
export const useCreateShipment = (
  options?: UseMutationOptions<
    CreateShipmentResponseType,
    ErrorResponseType,
    CreateShipmentInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: createShipment,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getShipments.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useDeletShipment = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteShipmentInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteShipment,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getShipments.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useBulkDeleteShipment = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteBulkShipmentInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteBulkShipments,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [getShipments.name] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

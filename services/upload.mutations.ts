import { User } from "@/types/services/auth.types";
import { apiAxios } from "@/utils/api.utils";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Shipment } from "./shipment.queries";
import { ErrorResponseType, SuccessResponseType } from "./types.common";

// types
export interface ShipmentFileUploadInputType {
  files: FormData;
  shipmentId: number;
}

export interface ProfileImageUploadResponseType
  extends Omit<SuccessResponseType, "payload"> {
  data: User;
}

export interface ShipmentUploadResponseType
  extends Omit<SuccessResponseType, "payload"> {
  data: Shipment;
}

export interface CreateBulkShipmentInputType {
  file: FormData;
}

// services
export const profileUpload = async (input: FormData) => {
  const { data } = await apiAxios.post<ProfileImageUploadResponseType>(
    "/upload/profile",
    input,
  );
  return data;
};

export const shipmentFileUpload = async (
  input: ShipmentFileUploadInputType,
) => {
  const { shipmentId, files } = input;
  const { data } = await apiAxios.post<ShipmentUploadResponseType>(
    `/upload/shipment/${shipmentId}`,
    files,
  );
  return data;
};

export const createBulkShipment = async (
  input: FormData,
): Promise<SuccessResponseType> => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    "/upload/shipment/excel",
    input,
  );

  return data;
};

// mutations

export const useProfileUpload = (
  options?: UseMutationOptions<
    ProfileImageUploadResponseType,
    ErrorResponseType,
    FormData
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: profileUpload,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useShipmentFileUpload = (
  options?: UseMutationOptions<
    ShipmentUploadResponseType,
    ErrorResponseType,
    ShipmentFileUploadInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: shipmentFileUpload,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useCreateBulkShipment = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    FormData
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: createBulkShipment,
  });
};

import { apiAxios } from "@/utils/api.utils";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Shipment, TrackWithType } from "./shipment.queries";
import { ErrorResponseType, SuccessResponseType } from "./types.common";

// export type Email = `${string}@${string}.${string}`;
//types
export interface CreateShipmentInputType {
  trackWith: TrackWithType;
  carrier: string;
  tags: string[];
  followers: string[];
  referenceNo: string | null;
  containerNo: string;
  mblNo: string | null;
}

export interface UpdateShipmentInputType {
  tags?: string[];
  followers?: string[];
  referenceNo?: string | null;
  id?: number;
}

export interface CreateUpdateShipmentResponseType {
  status: string;
  message: string;
  data: Shipment;
}

export interface DeleteShipmentInputType {
  id: number;
}
export interface DeleteShipmentFileInputType {
  id: number;
  fileName: string;
}
export interface DeleteBulkShipmentInputType {
  ids: number[];
}

export interface SetFilesShareableInputType {
  shipmentId: number;
  filesShareable: boolean;
}
export interface BuildShipmentShareableLinkInputType {
  shipmentId: string;
}
export interface DiscardShipmentShareableLinkInputType {
  shipmentId: string;
}

export interface BuildShipmentShareableLinkResponseType
  extends Omit<SuccessResponseType, "payload"> {
  data: {
    shareableLink: string;
  };
}

//services

export const createShipment = async (
  input: CreateShipmentInputType,
): Promise<CreateUpdateShipmentResponseType> => {
  const { data } = await apiAxios.post<CreateUpdateShipmentResponseType>(
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

export const deleteShipmentFile = async (
  input: DeleteShipmentFileInputType,
) => {
  const { id, fileName } = input;
  const { data } = await apiAxios.delete<SuccessResponseType>(
    `/shipments/${id}/file/${fileName}`,
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
      params: { ids: ids },
    },
  );
  return data;
};

export const buildShipmentShareableLink = async (
  input: BuildShipmentShareableLinkInputType,
) => {
  const { data } = await apiAxios.post<BuildShipmentShareableLinkResponseType>(
    `/shipments/share`,
    input,
  );
  return data;
};

export const discardShipmentShareableLink = async (
  input: DiscardShipmentShareableLinkInputType,
) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    `shipments/share/discard`,
    input,
  );
  return data;
};

export const setFilesShareable = async (input: SetFilesShareableInputType) => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    `/shipments/share/files-shareable`,
    input,
  );
  return data;
};

export const updateShipment = async (input: UpdateShipmentInputType) => {
  const { id, ...rest } = input;
  const { data } = await apiAxios.patch<CreateUpdateShipmentResponseType>(
    `/shipments/${id}`,
    rest,
  );
  return data;
};

//hooks
export const useCreateShipment = (
  options?: UseMutationOptions<
    CreateUpdateShipmentResponseType,
    ErrorResponseType,
    CreateShipmentInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: createShipment,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
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
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useDeletShipmentFile = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DeleteShipmentFileInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteShipmentFile,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useBuildShipmentShareableLink = (
  options?: UseMutationOptions<
    BuildShipmentShareableLinkResponseType,
    ErrorResponseType,
    BuildShipmentShareableLinkInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: buildShipmentShareableLink,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
      await options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useDiscardShipmentShareableLink = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    DiscardShipmentShareableLinkInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: discardShipmentShareableLink,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useSetFilesShareable = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    SetFilesShareableInputType
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: setFilesShareable,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
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
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdateShipment = (
  options?: UseMutationOptions<
    CreateUpdateShipmentResponseType,
    ErrorResponseType,
    UpdateShipmentInputType
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: updateShipment,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
      await queryClient.invalidateQueries({ queryKey: ["getShipmentById"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

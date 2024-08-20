//types

import { apiAxios } from "@/utils/api.utils";

import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreateUpdateShipmentResponseType,
  UpdateShipmentInputType,
} from "../shipment.mutations";
import { getShipments } from "../shipment.queries";
import { ErrorResponseType } from "../types.common";

//services
interface AdminUpdateShipmentInputType extends UpdateShipmentInputType {
  containerNo?: string;
  mblNo?: string;
  carrier?: string;
}

export const adminUpdateShipment = async (
  input: AdminUpdateShipmentInputType,
) => {
  const { id, ...rest } = input;
  const { data } = await apiAxios.patch<CreateUpdateShipmentResponseType>(
    `/admin/shipments/${id}`,
    rest,
  );
  return data;
};

//hooks

export const useAdminUpdateShipment = (
  options?: UseMutationOptions<
    CreateUpdateShipmentResponseType,
    ErrorResponseType,
    AdminUpdateShipmentInputType
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: adminUpdateShipment,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: ["getShipments"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

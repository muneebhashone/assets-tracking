import { apiAxios } from "@/utils/api.utils";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { GetShipmentByIdInput } from "./shipment.queries";
import { ErrorResponseType, SuccessResponseType } from "./types.common";

//types

//services

export const sendTrackingEmail = async (
  input: GetShipmentByIdInput,
): Promise<SuccessResponseType> => {
  const { data } = await apiAxios.post<SuccessResponseType>(
    `/trackings/${input.shipmentId}`,
  );

  return data;
};

//hooks
export const useSendTrackingEmail = (
  options?: UseMutationOptions<
    SuccessResponseType,
    ErrorResponseType,
    GetShipmentByIdInput
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: sendTrackingEmail,
    async onSuccess(data, variables, context) {
      options?.onSuccess?.(data, variables, context);
    },
  });
};

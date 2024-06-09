import { SearatesSealineApiResponse } from "@/types";
import { searatesApiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export type TrackShipmentInput = {
  trackingNumber: string;
  carrier: string;
};

export const fetchAllSearatesContainers = async () => {
  const { data } =
    await searatesApiAxios.get<SearatesSealineApiResponse>(`/info/sealines`);

  return data;
};

export const useFetchAllSearatesContainers = (
  options?: UseQueryOptions<SearatesSealineApiResponse, unknown>,
) => {
  return useQuery({
    ...options,
    queryFn: fetchAllSearatesContainers,
    queryKey: [fetchAllSearatesContainers.name],
  });
};

import { SearatesSealineApiResponse } from "@/types/api.types";
import { apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export type TrackShipmentInput = {
  trackingNumber: string;
  carrier: string;
};

export type ShipmentFetchContainerType = {
  name: string;
  code: string;
};

export const fetchAllSearatesContainerSetup = async () => {
  const res = await apiAxios.get<SearatesSealineApiResponse>(`/setup/sealines`);
  const { data } = res;

  return data;
};

export const useFetchAllSearatesContainerSetup = (
  options?: UseQueryOptions<SearatesSealineApiResponse, unknown>,
) => {
  return useQuery({
    ...options,
    queryFn: fetchAllSearatesContainerSetup,
    queryKey: ["fetchAllSearatesContainerSetup"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

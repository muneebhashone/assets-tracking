import { SearatesSealineApiResponse } from "@/types/api.types";
import { searatesApiAxios, apiAxios } from "@/utils/api.utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export type TrackShipmentInput = {
  trackingNumber: string;
  carrier: string;
};

export type ShipmentFetchContainerType = {
  name: string;
  code: string;
};
export const fetchAllSearatesContainers = async () => {
  const res =
    await searatesApiAxios.get<SearatesSealineApiResponse>(`/info/sealines`);
  const { data } = res;

  return data;
};

export const fetchAllSearatesContainerSetup = async () => {
  const res = await apiAxios.get<SearatesSealineApiResponse>(`/setup/sealines`);
  const { data } = res;

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

export const useFetchAllSearatesContainerSetup = (
  options?: UseQueryOptions<SearatesSealineApiResponse, unknown>,
) => {
  return useQuery({
    ...options,
    queryFn: fetchAllSearatesContainerSetup,
    queryKey: [fetchAllSearatesContainerSetup.name],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

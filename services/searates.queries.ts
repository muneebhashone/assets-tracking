import { SearatesSealineApiResponse } from "@/types";
import { searatesApiAxios } from "@/utils/api.utils";
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
  const nameScacPairs = data.data?.flatMap((company) => {
    return company.scac_codes.map((scacCode) => {
      return { name: `${company.name} (${scacCode})`, code: scacCode };
    });
  });
  return nameScacPairs;
};

export const useFetchAllSearatesContainers = (
  options?: UseQueryOptions<ShipmentFetchContainerType[], unknown>,
) => {
  return useQuery({
    ...options,
    queryFn: fetchAllSearatesContainers,
    queryKey: [fetchAllSearatesContainers.name],
  });
};

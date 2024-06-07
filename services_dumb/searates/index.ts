import { SeaRatesApiResponse, SearatesSealineApiResponse } from "@/types";
import { searatesApiAxios } from "@/utils/api.utils";
import { AxiosResponse } from "axios";

export const trackShipment = async (
  tracking_number: string,
  carrier: string,
): Promise<AxiosResponse<SeaRatesApiResponse>> => {
  return searatesApiAxios.get(
    `/tracking?number=${tracking_number}&sealine=${carrier}` as string,
  );
};

export const fetchAllSearatesContainers = async () => {
  try {
    const res = await searatesApiAxios.get<SearatesSealineApiResponse>(
      `${process.env.NEXT_PUBLIC_SEARATES_URL}/info/sealines` as string,
    );
    const { data } = res.data;
    const nameScacPairs = data.flatMap((company) => {
      return company.scac_codes.map((scacCode) => {
        return { name: `${company.name} (${scacCode})`, code: scacCode };
      });
    });
    return nameScacPairs;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

import { SeaRatesApiResponse, SearatesSealineApiResponse } from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";

export const seaRatesApi = async (
  tracking_number: string,
  carrier: string,
): Promise<AxiosResponse<SeaRatesApiResponse>> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SEARATES_URL}/tracking?api_key=${process.env.SEARATES_API_KEY}&number=${tracking_number}&sealine=${carrier}` as string,
  );
  return res;
};

export const getAllSeaRatesContainer = async () => {
  try {
    const res: AxiosResponse<SearatesSealineApiResponse> =
      (await axios.get(
        `${process.env.NEXT_PUBLIC_SEARATES_URL}/info/sealines` as string,
      )) || [];
    const { data } = res.data;
    const nameScacPairs = data.flatMap((company) => {
      return company.scac_codes.map((scacCode) => {
        return { name: `${company.name} (${scacCode})`, code: scacCode };
      });
    });
    return nameScacPairs;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }

    if (err instanceof AxiosError) {
      console.error(err.message);
    }

    console.error(err);
  }
  //   return res;
};

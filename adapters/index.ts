import { db } from "@/lib/db";
import { seaRatesApi } from "@/services/searates";
import { SeaRatesApiResponse } from "@/types";
import { SEARATES_CODES } from "@/types/messgaes";
import { AxiosResponse } from "axios";

export const searatesAdapter = async (payload: {
  carrier: string;
  tracking_number: string;
  userId: number;
}) => {
  const { carrier, tracking_number, userId } = payload;

  const res: AxiosResponse<SeaRatesApiResponse> = await seaRatesApi(
    tracking_number,
    carrier,
  );
  if (res.data.status === "success") {
    const metadata = res.data.data.metadata;
    const vesselData = res.data.data.vessels.map((ves) => {
      return { name: ves.name, flag: ves.flag, fid: ves.id };
    });
    const data = {
      type: metadata.type,
      aggregator: "SEARATE",
      sealine: metadata.sealine_name,
      carrier: metadata.sealine,
      status: metadata.status,
      userId: userId,
      tracking_number,
      arrivalTime: res.data.data.route.pod.date,
    };
    if (vesselData.length) {
      const ship = await db.shipment.create({
        data: { ...data, vessels: { create: vesselData } },
      });
      return {
        status: res.data.status,
        data: ship,
        message: SEARATES_CODES[res.data.message],
      };
    }
    const ship = await db.shipment.create({ data: { ...data } });
    return {
      status: res.data.status,
      data: ship,
      message: SEARATES_CODES[res.data.message],
    };
  }
  return {
    status: "error",
    message: SEARATES_CODES[res.data.message],
    data: null,
  };
};

export const adapterHandler = async (
  option: string,
  payload: { carrier: string; tracking_number: string; userId: number },
) => {
  switch (option) {
    case "SEARATE":
      return await searatesAdapter(payload);
  }
};

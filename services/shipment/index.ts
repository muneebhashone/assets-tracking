"use server";

import { coins_err } from "@/types/messgaes";
import { checkCompanyCredits } from "@/utils";
import axios from "axios";

export const createShipmentEntry = async (body: {
  trackingNumber: string;
  companyId: number;
  carrier: string;
  creatorId: number;
}) => {
  const check = await checkCompanyCredits(Number(body.companyId));

  if (!check) {
    return { status: "error", message: coins_err };
  }
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_QUEUE_SERVER_URL}/api/shipment/insert-shipment`,
      body,
    );
  } catch (err) {
    // @ts-ignore
    console.log(err?.message);
  }
  return {
    status: "waiting",
    message:
      "Your Shipment Request has been submitted, you will be notified soon.",
  };
};

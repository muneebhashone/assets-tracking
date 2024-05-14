"use server";

import { coins_err } from "@/types/messgaes";
import { checkUserCredits } from "@/utils";
import axios from "axios";

export const createShipmentEntry = async (body: {
  trackingNumber: string;
  userId: number;
  carrier: string;
}) => {
  const check = await checkUserCredits(Number(body.userId));
  if (!check) {
    return { status: "error", message: coins_err };
  }
  await axios.post(
    `${process.env.NEXT_PUBLIC_QUEUE_SERVER_URL}/api/shipment/insert-shipment`,
    body,
  );
  return {
    status: "waiting",
    message:
      "Your Shipment Request has been submitted, you will be notified soon.",
  };
};

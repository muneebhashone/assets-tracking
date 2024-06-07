import { coins_err } from "@/types/messgaes";
import axios from "axios";

export const createShipmentEntry = async (body: {
  trackingNumber: string;
  companyId: number;
  carrier: string;
  creatorId: number;
}) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_QUEUE_SERVER_URL}/api/shipment/credits/${body.companyId}`,
    );

    if (!data?.credits) {
      return { status: "error", message: coins_err };
    }

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

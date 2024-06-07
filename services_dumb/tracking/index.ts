import axios from "axios";

export const createTrackingQueueEntry = async (body: {
  trackingNumber: string;
  userId: number;
  arrivalTime: string;
  carrier: string;
}) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_QUEUE_SERVER_URL}/api/tracking/create-tracking-queue`,
    body,
  );
  return res.data;
};

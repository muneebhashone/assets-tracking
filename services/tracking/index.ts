import axios from "axios";

export const createTrackingQueueEntry = async (body: {
  trackingNumber: string;
  userId: number;
  arrivalTime: string;
  carrier: string;
}) => {
  const res = await axios.post(
    `${process.env.QUEUE_SERVER_URL}/tracking/create-tracking-queue`,
    body,
  );
  return res.data;
};

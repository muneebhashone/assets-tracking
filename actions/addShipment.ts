// "use server";
// import { auth } from "@/lib/auth-options";
// import { removeCoins } from "./insertCoins";
// import { ICreateShipment, IShipmentData } from "@/types";
// import { shipmentType } from "@/types/enums";
// import { checkUserCredits } from "@/utils";
// import { db } from "@/lib/db";
// import { shipment_mock } from "./mockData";
// import { coins_err, internal_server_error } from "@/types/messgaes";

// export const shipmentData = async (payload: IShipmentData) => {
//   const sesion = await auth();
//   const { containerType, containerID } = payload;
//   const id = Number(sesion?.user.id);
//   const check = await checkUserCredits(id);
//   if (!check) {
//     return coins_err;
//   }
//   // await removeCoins(id);
//   if (containerType === shipmentType.ZIMLINE && containerID)
//     return shipment_mock;

//   return internal_server_error;
// };

// export const insertShipmentRecord = async (
//   userId: number,
//   payload: ICreateShipment,
// ) => {
//   try {
//     const { arivalTime, carrier, reference, shipment, status } = payload;
//     console.log({ payload, userId });
//     // await db.shipment.create({
//     //   data: {
//     //     carrier,
//     //     reference,
//     //     shipment,
//     //     status,
//     //     userId,
//     //     arivalTime,
//     //   },
//     // });
//     return "shipment added";
//   } catch (error) {
//     return error;
//   }
// };

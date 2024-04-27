"use server";
import { auth } from "@/lib/auth-options";
import { removeCoins } from "./insertCoins";
import { ApiResponse, ICreateShipment, IResponse, IShipmentData, ROLE, ShipmentData } from "@/types";
import { DBErrors, shipmentType } from "@/types/enums";
import { checkUserCredits } from "@/utils";
import { db } from "@/lib/db";
import { shipment_mock } from "./mockData";
import { coins_err, internal_server_error, shipment_creation_error } from "@/types/messgaes";
import axios, { AxiosResponse } from "axios";
import { adapterHandler, searatesAdapter } from "@/adapters";
import { Prisma, Shipment } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// export const shipmentData = async () => {
//   const sesion = await auth();
//   // const { containerType, containerID } = payload;
//   const id = Number(sesion?.user.id);
//   const check = await checkUserCredits(id);
//   if (!check) {
//     return coins_err;
//   }
//   // await removeCoins(id);
//   // if (containerType === shipmentType.ZIMLINE && containerID)
//   //   return shipment_mock;

//   return internal_server_error;
// };


// export const getShippingData = async (
//   number: string,
//   carrier: string
// ) => {

//   if (res.data.status === "success") {
//     return res.data
//   }
//   return null
// }
export const getShipmentByUserId = async (userId: number) => {

    try {
        const shippingData = await db.shipment.findMany({ where: { userId: userId } })
        if (shippingData) {
            return shippingData
        }
        return null
    } catch (error) {
        return error
    }
}

export const getAllShipments = async () => {
    const admin = await auth()


    try {
        if (admin?.user.role !== ROLE.ADMIN) {
            return new Error('UnAuthorized')
        }
        const shippingData = await db.shipment.findMany()
        if (shippingData.length) {
            return shippingData
        }
        return null
    } catch (error) {
        return error
    }
}

export const getShipmentByTrackingNumber = async (trackingNumber: string) => {

    try {
        const shippingData = await db.shipment.findFirst({ where: { tracking_number: trackingNumber }, include: { user: true, vessels: true } })

        if (shippingData) {
            const vesselData = await db.vessel.findMany({ where: { shipment_id: shippingData?.id } })
            // if (vesselData.length) {
            //     // const data = { ...shippingData, vessels: vesselData }
            //     return data as ShipmentData
            // }
            return shippingData as Shipment
        }
        return null
    } catch (error) {
        return error
    }
}


export const insertShipmentRecord: (payload: ICreateShipment) => Promise<IResponse> | unknown = async (
    // userId: number,
    payload: ICreateShipment,
) => {
    try {
        const sesion = await auth();
        const userId = Number(sesion?.user.id);
        const { tracking_number, carrier } = payload
        const check = await checkUserCredits(userId);

        if (!check) {
            return { status: "error", message: coins_err };
        }


        const res = await adapterHandler(carrier, { carrier, tracking_number, userId })
        if (res) {
            await removeCoins(userId);
            return { status: "success", message: "shipment added" }
        }
        return { status: "error", message: shipment_creation_error };;
    } catch (error) {
        // console.log(error: Prisma.PrismaClientKnownRequestError)
        if (error.code === DBErrors.UNIQUE_KEY_ERROR)
            return { status: "error", message: "Shipment Already Made" };
    }
};

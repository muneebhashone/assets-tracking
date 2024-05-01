"use server";
import { auth } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { ICreateShipment, IResponse, ROLE } from "@/types";
import { DBErrors } from "@/types/enums";
import { checkUserCredits } from "@/utils";
import { removeCoins } from "./insertCoins";

import { coins_err, shipment_creation_error } from "@/types/messgaes";

import { adapterHandler } from "@/adapters";
import { Prisma, PrismaClient, Shipment } from "@prisma/client";
import { createTrackingQueueEntry } from "@/services/tracking";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";



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
        const shippingData = await db.shipment.findMany({ include: { user: true } })
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
            return shippingData as Shipment
        }
        return null
    } catch (error) {
        return error
    }
}


export const insertShipmentRecord: (payload: ICreateShipment) => Promise<IResponse> | unknown = async (

    payload: ICreateShipment,
) => {
    try {
        const session = await auth();
        const userId = Number(session?.user.id);
        const { tracking_number, carrier } = payload
        const check = await checkUserCredits(userId);
        if (!check) {
            return { status: "error", message: coins_err };
        }
        const res = await adapterHandler(carrier, { carrier, tracking_number, userId })
        if (res) {
            const statusCheckData = { trackingNumber: res.tracking_number, arrivalTime: res.arrivalTime, userId: res.userId }
            await removeCoins(userId);
            await createTrackingQueueEntry(statusCheckData);
            return { status: "success", message: "shipment added" }
        }
        return { status: "error", message: shipment_creation_error };;
    } catch (error: unknown | PrismaClientKnownRequestError) {
        if ((error as PrismaClientKnownRequestError)?.code === DBErrors.UNIQUE_KEY_ERROR)
            return { status: "error", message: "Shipment Already Made" };
        return { status: "error", message: (error as Error).message }
    }
};



// export const trackingShipmentStatus = async (status: string) => {
//     const
//     if (status == )


// }

"use server";
import { auth } from "@/lib/auth-options";
import { db } from "@/lib/db";
import {
  ICreateShipment,
  IResponse,
  ROLE,
  ShipmentData,
  shipmentDataWithPagination,
} from "@/types";
import { DBErrors, ShipmentState } from "@/types/enums";
import { checkUserCredits, getPaginator } from "@/utils";
import { removeCoins } from "./insertCoins";

import { coins_err, shipment_creation_error } from "@/types/messgaes";

import { adapterHandler } from "@/adapters";
import { Prisma, PrismaClient, Shipment } from "@prisma/client";
import { createTrackingQueueEntry } from "@/services/tracking";
import {
  DefaultArgs,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";

export const getShipmentByUserId = async (params: {
  searchString: string | null;
  limitParam: number;
  pageParam: number;
  userId: number;
}): Promise<shipmentDataWithPagination | Error> => {
  const { limitParam, pageParam, userId } = params;
  let filter: Prisma.ShipmentFindManyArgs = {
    where: { userId: userId },
  };
  if (params.searchString) {
    filter["where"] = {
      ...filter.where,
      OR: [
        {
          tracking_number: {
            contains: params.searchString,
            mode: "insensitive",
          },
        },
        { carrier: { contains: params.searchString, mode: "insensitive" } },
        { type: { contains: params.searchString, mode: "insensitive" } },
        { status: { contains: params.searchString, mode: "insensitive" } },
        {
          arrivalTime: { contains: params.searchString, mode: "insensitive" },
        },
      ],
    };
  }
  const totalRecords = await db.shipment.count(
    filter as Prisma.ShipmentCountArgs<DefaultArgs>,
  );
  const paginatorInfo = getPaginator(limitParam, pageParam, totalRecords);
  try {
    const shippingData = await db.shipment.findMany({
      ...filter,
      distinct: "id",
      skip: paginatorInfo.skip,
      take: paginatorInfo.pageSize,
    });
    return {
      data: shippingData.length ? (shippingData as ShipmentData[]) : null,
      paginatorInfo,
    };
  } catch (error) {
    return error as Error;
  }
};

export const getAllShipments = async (params: {
  searchString: string | null;
  limitParam: number;
  pageParam: number;
}): Promise<shipmentDataWithPagination | Error> => {
  const admin = await auth();

  const { limitParam, pageParam } = params;

  let filter: Prisma.ShipmentFindManyArgs = {};

  if (params.searchString) {
    filter["where"] = {
      OR: [
        {
          tracking_number: {
            contains: params.searchString,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: { contains: params.searchString, mode: "insensitive" },
          },
        },
        { carrier: { contains: params.searchString, mode: "insensitive" } },
        { type: { contains: params.searchString, mode: "insensitive" } },
        { status: { contains: params.searchString, mode: "insensitive" } },
        { arrivalTime: { contains: params.searchString, mode: "insensitive" } },
      ],
    };
  }
  const totalRecords = await db.shipment.count(
    filter as Prisma.ShipmentCountArgs<DefaultArgs>,
  );
  const paginatorInfo = getPaginator(limitParam, pageParam, totalRecords);

  try {
    if (admin?.user.role !== ROLE.ADMIN) {
      return new Error("UnAuthorized");
    }
    // const filter =
    const shippingData = await db.shipment.findMany({
      ...filter,
      distinct: "id",
      skip: paginatorInfo.skip,
      take: paginatorInfo.pageSize,
    });

    return {
      data: shippingData.length ? (shippingData as ShipmentData[]) : null,
      paginatorInfo,
    };
  } catch (error) {
    return error as Error;
  }
};

export const getShipmentByTrackingNumber = async (trackingNumber: string) => {
  try {
    const shippingData = await db.shipment.findFirst({
      where: { tracking_number: trackingNumber },
      include: { user: true, vessels: true },
    });

    if (shippingData) {
      return shippingData as Shipment;
    }
    return null;
  } catch (error) {
    return error;
  }
};

export const insertShipmentRecord: (
  payload: ICreateShipment,
) => Promise<IResponse> | unknown = async (payload: ICreateShipment) => {
  try {
    const session = await auth();
    const userId = Number(session?.user.id);
    const { tracking_number, carrier } = payload;
    const check = await checkUserCredits(userId);
    if (!check) {
      return { status: "error", message: coins_err };
    }
    const res = await adapterHandler(carrier, {
      carrier,
      tracking_number,
      userId,
    });
    if (res) {
      const statusCheckData = {
        trackingNumber: res.tracking_number,
        arrivalTime: res.arrivalTime,
        userId: res.userId,
      };
      await removeCoins(userId);
      await createTrackingQueueEntry(statusCheckData);
      return { status: "success", message: "shipment added" };
    }
    return { status: "error", message: shipment_creation_error };
  } catch (error: unknown | PrismaClientKnownRequestError) {
    if (
      (error as PrismaClientKnownRequestError)?.code ===
      DBErrors.UNIQUE_KEY_ERROR
    )
      return { status: "error", message: "Shipment Already Made" };
    return { status: "error", message: (error as Error).message };
  }
};

export const getAllStatusData = async () => {
  const admin = await auth();
  if (admin?.user.role !== ROLE.ADMIN) {
    return new Error("UnAuthorized");
  }
  const statusCounts = await db.shipment.groupBy({
    by: ["status"],
    _count: true,
  });

  // Transform the response to match the desired format
  const formattedResponse = statusCounts.map(({ status, _count }) => ({
    name: status,
    count: _count,
  }));
  return formattedResponse;
};

export const getShipmentDataByYear = async (year: number) => {
  const monthCounts = await db.$queryRaw`
SELECT
    TO_CHAR(created_at, 'Mon') AS name,
    CAST(COUNT(*) AS INTEGER) AS count
FROM "Shipment"
WHERE
    EXTRACT(YEAR FROM created_at) = ${year}
GROUP BY
    TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
ORDER BY
    EXTRACT(MONTH FROM created_at)
`;
  if ((monthCounts as Array<Record<string, number>>)?.length) {
    return monthCounts;
  }
  return null;
};

export const shipmentNumber = async (
  status?: ShipmentState,
  userId?: number,
) => {
  let filter: Prisma.ShipmentCountArgs = {
    where: {
      AND: [{ user: { role: { not: ROLE.ADMIN } } }],
    },
  };
  if (userId) {
    filter?.where?.AND?.push({ user: { id: userId } });
  }
  if (status) {
    switch (status) {
      case ShipmentState.DELIVERED:
        filter?.where?.AND?.push({
          status: { equals: ShipmentState.DELIVERED },
        });
        break;
      case ShipmentState.PLANNED:
        filter?.where?.AND?.push({
          status: { equals: ShipmentState.PLANNED },
        });

        break;
      case ShipmentState.IN_TRANSIT:
        filter?.where?.AND?.push({
          status: { equals: ShipmentState.IN_TRANSIT },
        });

        break;
      case ShipmentState.UNKNOWN:
        filter?.where?.AND?.push({ status: { equals: ShipmentState.UNKNOWN } });

        break;
    }
  }

  const shipmentCount = await db.shipment.count(filter);
  return { shipmentCount };
};

"use server";
import { auth } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { ROLE, ShipmentData, shipmentDataWithPagination } from "@/types";
import { ShipmentState, userState } from "@/types/enums";
import { getPaginator } from "@/utils";

import { Prisma, Shipment } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { getUserCount } from "./usersActions";
import { Session } from "next-auth";
interface MonthData {
  name: string;
  count: number;
}
export const getShipmentByUserId = async (params: {
  searchString: string | null;
  limitParam: number;
  pageParam: number;
  creatorId: number;
  companyId: number;
}): Promise<shipmentDataWithPagination | Error> => {
  const { limitParam, pageParam, companyId } = params;
  let filter: Prisma.ShipmentFindManyArgs = {
    where: {
      companyId,
    },
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
        { sealine: { contains: params.searchString, mode: "insensitive" } },
        { type: { contains: params.searchString, mode: "insensitive" } },
        { status: { contains: params.searchString, mode: "insensitive" } },
        {
          arrivalTime: { contains: params.searchString, mode: "insensitive" },
        },
      ],
    };
  }
  try {
    const totalRecords = await db.shipment.count(
      filter as Prisma.ShipmentCountArgs<DefaultArgs>,
    );
    const paginatorInfo = getPaginator(limitParam, pageParam, totalRecords);
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
        { sealine: { contains: params.searchString, mode: "insensitive" } },
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
    if (admin?.user.role !== ROLE.SUPER_ADMIN) {
      return new Error("UnAuthorized");
    }
    // const filter =
    const shippingData = await db.shipment.findMany({
      ...filter,
      include: {
        user: { select: { name: true } },
      },
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

// export const insertShipmentRecord: (
//   payload: ICreateShipment,
// ) => Promise<IResponse> | unknown = async (payload: ICreateShipment) => {
//   try {
//     const { tracking_number, carrier, userId } = payload;
//     const check = await checkUserCredits(userId);

//     if (!check) {
//       return { status: "error", message: coins_err };
//     }
//     const res = await adapterHandler("SEARATE", {
//       carrier,
//       tracking_number,
//       userId,
//     });
//     if (res?.data) {
//       const ship = res?.data;
//       const statusCheckData = {
//         trackingNumber: ship.tracking_number,
//         arrivalTime: ship.arrivalTime,
//         userId: ship.userId,
//         carrier: carrier,
//       };
//       await removeCoins(userId);
//       await createTrackingQueueEntry(statusCheckData);
//     }
//     return { status: res?.status, message: res?.message };
//   } catch (error: unknown | PrismaClientKnownRequestError) {
//     if (
//       (error as PrismaClientKnownRequestError)?.code ===
//       DBErrors.UNIQUE_KEY_ERROR
//     )
//       return { status: "warning", message: "Shipment Already Made" };
//     return { status: "error", message: (error as Error).message };
//   }
// };

export const getAllStatusData = async () => {
  let statusCounts;
  const session = await auth();
  if (session?.user.role === ROLE.USER) {
    return null;
  } else if (session?.user.role === ROLE.ADMIN) {
    statusCounts = await db.shipment.groupBy({
      by: ["status"],
      _count: true,
      where: {
        companyId: session?.user.companyId,
      },
    });
  } else {
    statusCounts = await db.shipment.groupBy({
      by: ["status"],
      _count: true,
    });
  }

  const formattedResponse = statusCounts.map(({ status, _count }) => ({
    name: status,
    count: _count,
  }));

  return formattedResponse.length ? formattedResponse : null;
};

export const getShipmentDataByYear = async (
  year: number,
  user?: Session["user"],
) => {
  let query = Prisma.sql`
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
  if (user?.role !== ROLE.SUPER_ADMIN) {
    query = Prisma.sql`SELECT
    TO_CHAR(s.created_at, 'Mon') AS name,
    CAST(COUNT(*) AS INTEGER) AS count
FROM 
    "Shipment" s
JOIN 
    "User" u ON s."creatorId" = u.id
WHERE
    EXTRACT(YEAR FROM s.created_at) = ${year}
    AND u.id = ${user?.id} 
GROUP BY
    TO_CHAR(s.created_at, 'Mon'), EXTRACT(MONTH FROM s.created_at)
ORDER BY
    EXTRACT(MONTH FROM s.created_at)`;
  }
  // console.log(monthCounts)
  const monthCounts: MonthData[] = (await db.$queryRaw(query)) || [];
  const allMonths = [
    { name: "Jan", count: 0 },
    { name: "Feb", count: 0 },
    { name: "Mar", count: 0 },
    { name: "Apr", count: 0 },
    { name: "May", count: 0 },
    { name: "Jun", count: 0 },
    { name: "Jul", count: 0 },
    { name: "Aug", count: 0 },
    { name: "Feb", count: 0 },
    { name: "Sep", count: 0 },
    { name: "Oct", count: 0 },
    { name: "Nov", count: 0 },
    { name: "Dec", count: 0 },
  ];

  if (monthCounts?.length) {
    monthCounts.forEach((element) => {
      const monthIndex = allMonths.findIndex((x) => x.name === element.name);
      if (monthIndex !== -1) {
        allMonths[monthIndex].count = element.count;
      }
    });

    return allMonths;
  }
  return null;
};

export const getShipmentDatabyRole = async (role: ROLE, companyId?: number) => {
  switch (role) {
    case ROLE.SUPER_ADMIN:
      return await Promise.all([
        shipmentNumber(),
        getUserCount(),
        getUserCount(userState.REJECTED),
        getUserCount(userState.ACCEPTED),
        getUserCount(userState.PENDING),
      ]);
    case ROLE.ADMIN:
      return await Promise.all([
        shipmentNumber(undefined, companyId),
        getUserCount(undefined, companyId),
        getUserCount(userState.REJECTED, companyId),
        getUserCount(userState.ACCEPTED, companyId),
        getUserCount(userState.PENDING, companyId),
      ]);

    case ROLE.USER:
      return await Promise.all([
        shipmentNumber(undefined, companyId),
        shipmentNumber(ShipmentState.PLANNED, companyId),
        shipmentNumber(ShipmentState.UNKNOWN, companyId),
        shipmentNumber(ShipmentState.DELIVERED, companyId),
        shipmentNumber(ShipmentState.IN_TRANSIT, companyId),
      ]);
  }
};

export const shipmentNumber = async (
  status?: ShipmentState,
  companyId?: number,
) => {
  let filter: Prisma.ShipmentCountArgs = {
    where: {
      AND: [{ user: { role: { not: ROLE.SUPER_ADMIN } } }],
    },
  };
  if (companyId) {
    (filter?.where?.AND as Prisma.ShipmentWhereInput[])?.push({
      company: { id: companyId },
    });
  }
  if (status) {
    switch (status) {
      case ShipmentState.DELIVERED:
        (filter?.where?.AND as Prisma.ShipmentWhereInput[])?.push({
          status: { equals: ShipmentState.DELIVERED },
        });
        break;
      case ShipmentState.PLANNED:
        (filter?.where?.AND as Prisma.ShipmentWhereInput[])?.push({
          status: { equals: ShipmentState.PLANNED },
        });

        break;
      case ShipmentState.IN_TRANSIT:
        (filter?.where?.AND as Prisma.ShipmentWhereInput[])?.push({
          status: { equals: ShipmentState.IN_TRANSIT },
        });

        break;
      case ShipmentState.UNKNOWN:
        (filter?.where?.AND as Prisma.ShipmentWhereInput[])?.push({
          status: { equals: ShipmentState.UNKNOWN },
        });

        break;
    }
  }

  const shipmentCount = await db.shipment.count(filter);
  return { shipmentCount };
};

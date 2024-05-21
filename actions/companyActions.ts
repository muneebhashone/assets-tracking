"use server";

import { db } from "@/lib/db";
import { getPaginator } from "@/utils";

export const getAllCompany = async (params: {
  searchString: string | null;
  limitParam: number;
  pageParam: number;
}) => {
  const { limitParam, pageParam } = params;
  const totalRecords = await db.shipment.count();
  const paginatorInfo = getPaginator(limitParam, pageParam, totalRecords);
  try {
    const company = await db.company.findMany({
      distinct: "id",
      skip: paginatorInfo.skip,
      take: paginatorInfo.pageSize,
    });
    return {
      data: company.length ? company : null,
      paginatorInfo,
    };
  } catch (error: any) {
    // any will be replaced later
    return {
      data: [],
      message: error?.message,
    };
  }
};

// "use client";

import {
  getAllStatusData,
  getShipmentDataByYear,
  getShipmentDatabyRole,
} from "@/actions/shipmentActions";
import { userData } from "@/actions/usersActions";
import DashboardView from "@/components/dashboard/DashboardView";
import UserDashboardView from "@/components/dashboard/UserView";
import { auth } from "@/lib/auth-options";
import { ROLE } from "@/types";
import { checkCompanyCredits } from "@/utils";
import { BarDatum } from "@nivo/bar";
import { User } from "@prisma/client";
import { Session } from "next-auth";

export interface IKpiData {
  userKpi: [
    {
      shipmentCount: number;
    },
    {
      shipmentCount: number;
    },
    {
      shipmentCount: number;
    },
    {
      shipmentCount: number;
    },
    {
      shipmentCount: number;
    },
  ];
  adminKpi: [
    {
      shipmentCount: number;
    },
    {
      usersCount: number;
    },
    {
      usersCount: number;
    },
    {
      usersCount: number;
    },
    {
      usersCount: number;
    },
  ];
}
export default async function page() {
  const session = (await auth()) as Session;

  const user = (await userData(session.user.id as string)) as User;

  // Review: Check api calls below. crashes page when data is undefined. set temporary value as undefined and check.
  const adminChart = (await getAllStatusData()) as readonly BarDatum[];
  const chartData = (await getShipmentDataByYear(
    2024,
    session.user.role === ROLE.USER ? user.id : undefined,
  )) as BarDatum[];
  const kpiData = await getShipmentDatabyRole(
    session.user.role,
    Number(session.user.id),
  );
  const credits = await checkCompanyCredits(session.user.companyId);

  console.log({ adminChart, chartData, kpiData });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight ">
          Hi, Welcome back {session?.user?.name}
        </h2>
        {session?.user.role !== ROLE.SUPER_ADMIN && (
          <div className="flex flex-col ">
            <h2 className="text-2xl font-bold tracking-tight ">
              Credits: {credits}
            </h2>
          </div>
        )}
      </div>

      {/* {session?.user.role !== ROLE.ADMIN ? (
        <UserDashboardView
          chartData={chartData}
          kpiData={kpiData as IKpiData["userKpi"]}
        />
      ) : (
        <DashboardView
          adminData={adminChart}
          kpiData={kpiData as IKpiData["adminKpi"]}
          chartData={chartData}
        />
      )} */}
    </div>
  );
}

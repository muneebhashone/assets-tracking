// "use client";

import {
  getAllStatusData,
  getShipmentDataByYear,
  shipmentNumber,
} from "@/actions/shipmentActions";
import { getUserCount, userData } from "@/actions/usersActions";
import DashboardView from "@/components/dashboard/DashboardView";
import UserDashboardView from "@/components/dashboard/UserView";

import { auth } from "@/lib/auth-options";
import { ROLE } from "@/types";
import { ShipmentState, userState } from "@/types/enums";
import { BarDatum } from "@nivo/bar";
import { User } from "@prisma/client";
import { Session } from "next-auth";

export default async function page() {
  const session = (await auth()) as Session;
  const user = (await userData(session.user.id as string)) as User;
  const adminChart = (await getAllStatusData()) as readonly BarDatum[];
  const chartData = (await getShipmentDataByYear(2024)) as BarDatum[];
  const kpiData = await Promise.all([
    shipmentNumber(),
    getUserCount(),
    getUserCount(userState.ACCEPTED),
    getUserCount(userState.REJECTED),
    getUserCount(userState.PENDING),
  ]);
  const userId =
    session.user.role === ROLE.USER ? Number(session.user.id) : undefined;
  const userKpiData = await Promise.all([
    shipmentNumber(undefined, userId),
    shipmentNumber(ShipmentState.PLANNED, userId),
    shipmentNumber(ShipmentState.UNKNOWN, userId),
    shipmentNumber(ShipmentState.DELIVERED, userId),
    shipmentNumber(ShipmentState.IN_TRANSIT, userId),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight ">
          Hi, Welcome back {session?.user?.name}
        </h2>
        {session?.user.role !== ROLE.ADMIN && (
          <div className="flex flex-col ">
            <h2 className="text-2xl font-bold tracking-tight ">
              Credits: {user?.credits}
            </h2>
            {/* <h2 className="text-3xl font-bold tracking-tight ">
                
              </h2> */}
          </div>
        )}
      </div>

      {session?.user.role !== ROLE.ADMIN ? (
        <UserDashboardView chartData={chartData} kpiData={userKpiData} />
      ) : (
        <DashboardView
          adminData={adminChart}
          kpiData={kpiData}
          chartData={chartData}
        />
      )}
    </div>
  );
}
